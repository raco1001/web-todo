import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Todolists } from '../../entities/Todolists';
import { Teams } from '../../entities/Teams';
import { TeamUsers } from '../../entities/TeamUsers';
import { Users } from '../../entities/Users';
import { CreateTeamDto } from './dto/create-team.dto';
import { DeleteTeamDto } from './dto/delete-team.dto';
import { ReadTeamTodolistDto } from './dto/read-team-todolists.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { DeleteMemberDto } from './dto/delete-member.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Teams)
    private teamsRepository: Repository<Teams>,

    @InjectRepository(TeamUsers)
    private teamUsersRepository: Repository<TeamUsers>,

    @InjectRepository(Todolists)
    private todolistsRepository: Repository<Todolists>,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createTeam(createTeamDto: CreateTeamDto): Promise<{ message: string }> {
    const { userId: id, teamName: name } = createTeamDto;

    const existingTeam = await this.teamsRepository.findOne({
      where: { name },
    });
    if (existingTeam) {
      const existingTeamUser = await this.teamUsersRepository.findOne({
        where: { teamId: existingTeam.id, userId: id },
      });
      if (existingTeamUser) {
        throw new BadRequestException('이미 존재하는 팀 이름입니다.');
      }
    }

    const newTeam = this.teamsRepository.create({
      name,
    });

    const newTeamRsult = await this.teamsRepository.save(newTeam);
    const newTeamUser = this.teamUsersRepository.create({
      teamId: newTeamRsult.id,
      userId: id,
    });
    await this.teamUsersRepository.save(newTeamUser);

    return { message: '팀 생성이 정상적으로 처리되었습니다.' };
  }

  async findTeamTodolists(
    readTeamTodolistDto: ReadTeamTodolistDto,
  ): Promise<{ message: string; data: { todo: object[]; done: object[] } }> {
    const { teamId: id } = readTeamTodolistDto;

    // 팀이 존재하는지 확인
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['todolists'],
    });

    if (!team) {
      throw new NotFoundException({ message: `팀(${id})을 찾을 수 없습니다.` });
    }

    const todoLists = team.todolists.reduce(
      (acc, todolist) => {
        if (todolist.status === true) {
          acc.todo.push({
            id: todolist.id,
            name: todolist.name,
            status: todolist.status,
          });
        } else if (todolist.status === false) {
          acc.done.push({
            id: todolist.id,
            name: todolist.name,
            status: todolist.status,
          });
        }
        return acc;
      },
      { todo: [], done: [] },
    );

    return {
      message: '팀 todolist 조회가 정상적으로 처리되었습니다.',
      data: todoLists,
    };
  }

  async updateTeamName(
    teamId: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<{ message: string; data: { userId: string; teams: object[] } }> {
    const { teamName: newName } = updateTeamDto;

    const team = await this.teamsRepository.findOne({ where: { id: teamId } });

    if (!team) {
      throw new NotFoundException(`ID가 ${teamId}인 팀을 찾을 수 없습니다.`);
    }

    team.name = newName;

    const updatedTeamRow = await this.teamsRepository.save(team);

    const updatedTeamUser = await this.teamUsersRepository.findOne({
      where: { teamId },
    });
    const userId = updatedTeamUser.userId;
    const updatedUserTeamLists: { teamId: string; teamName: string }[] =
      await this.teamUsersRepository
        .createQueryBuilder('teamUsers')
        .innerJoin('teamUsers.team', 'team') // 실제 조인
        .select(['team.id AS teamId', 'team.name AS teamName'])
        .where('teamUsers.userId = :userId', { userId })
        .orderBy('team.createdAt', 'ASC')
        .getRawMany();

    return {
      message: `팀 이름이 성공적으로 수정되었습니다. ${updatedTeamRow.name}`,
      data: { userId: userId, teams: updatedUserTeamLists },
    };
  }

  async removeTeam(
    deleteTeamDto: DeleteTeamDto,
  ): Promise<{ message: string; data: object }> {
    const { userId, teamId } = deleteTeamDto;

    const listIds: { id: number }[] = await this.teamsRepository
      .createQueryBuilder('teams')
      .innerJoin('teams.todolists', 'todolists')
      .select('todolists.id', 'id')
      .where('teams.id = :teamId', { teamId })
      .getRawMany();

    const listIdArray = listIds.map((list) => list.id);

    if (listIdArray.length > 0) {
      await this.todolistsRepository.delete({ id: In(listIdArray) });
    }
    await this.teamsRepository.delete({ id: teamId });

    const userTeams: { teamId: string; teamName: string }[] =
      await this.teamsRepository
        .createQueryBuilder('teams')
        .innerJoin(
          'teams.teamUsers',
          'teamUsers',
          'teamUsers.userId = :userId',
          {
            userId,
          },
        )
        .select(['teams.id AS teamId', 'teams.name AS teamName'])
        .orderBy('teams.createdAt', 'ASC')
        .getRawMany();

    return {
      message: `팀이 성공적으로 삭제되었습니다.${teamId}`,
      data: { userId: userId, teamLists: userTeams },
    };
  }

  async findTeamMembers(teamId: string): Promise<{
    message: string;
    data: { teamId: string; members: { userId: string; userName: string }[] };
  }> {
    const members: { userId: string; userName: string }[] =
      await this.teamUsersRepository
        .createQueryBuilder('team_users')
        .innerJoin('team_users.user', 'user') // Users 엔터티와 조인
        .select(['user.id AS userId', 'user.name AS userName'])
        .where('team_users.teamId = :teamId', { teamId })
        .orderBy('user.name', 'ASC')
        .getRawMany(); // 원시 결과를 객체 배열로 받음

    return {
      message: `모든 팀 멤버를 조회했습니다.`,
      data: { teamId: teamId, members: members },
    };
  }

  async addTeamMember(
    teamId: string,
    createMemberDto: CreateMemberDto,
  ): Promise<{
    message: string;
    data: { members: { userId: string; userName: string }[] };
  }> {
    const { userName } = createMemberDto;
    console.log(userName);

    const user = await this.usersRepository.findOne({
      where: { name: userName },
    });

    console.log(user);

    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const existingMember = await this.teamUsersRepository.findOne({
      where: { teamId, userId: user.id },
    });

    if (existingMember) {
      throw new BadRequestException('이미 팀에 존재하는 유저입니다.');
    }

    const addingMember = this.teamUsersRepository.create({
      teamId,
      userId: user.id,
    });

    await this.teamUsersRepository.save(addingMember);

    const members: { userId: string; userName: string }[] =
      await this.teamUsersRepository
        .createQueryBuilder('team_users')
        .innerJoin('team_users.user', 'user')
        .select(['user.id AS userId', 'user.name AS userName'])
        .where('team_users.teamId = :teamId', { teamId })
        .orderBy('user.name', 'ASC')
        .getRawMany();

    return {
      message: '유저가 팀에 성공적으로 추가되었습니다.',
      data: { members: members },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  async removeTeamMember(
    teamId: string,
    userDeleteDto: DeleteMemberDto,
  ): Promise<{
    data: { members: { userId: string; userName: string }[] };
  }> {
    const { userId } = userDeleteDto;
    await this.teamUsersRepository.delete({ teamId, userId });

    const members: { userId: string; userName: string }[] =
      await this.teamUsersRepository
        .createQueryBuilder('team_users')
        .innerJoin('team_users.user', 'user')
        .select(['user.id AS userId', 'user.name AS userName'])
        .where('team_users.teamId = :teamId', { teamId })
        .orderBy('user.name', 'ASC')
        .getRawMany();

    return {
      data: { members: members },
    };
  }
}
