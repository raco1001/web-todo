import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadPageDto } from './dto/read-page.dto';
import { Teams } from '../../entities/Teams';
import { TeamUsers } from '../../entities/TeamUsers';
import { Todolists } from '../../entities/Todolists';
import { Users } from '../../entities/Users';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(Teams)
    private teamsRepository: Repository<Teams>,

    @InjectRepository(TeamUsers)
    private teamUsersRepository: Repository<TeamUsers>,

    @InjectRepository(Todolists)
    private todolistsRepository: Repository<Todolists>,
  ) {}

  async findAll(
    readPageDto: ReadPageDto,
  ): Promise<{ message: string; data: object }> {
    const { userId } = readPageDto;

    const teams: { teamId: string; teamName: string }[] =
      await this.teamsRepository
        .createQueryBuilder('team')
        .innerJoin(
          'team.teamUsers',
          'teamUsers',
          'teamUsers.userId = :userId',
          {
            userId,
          },
        )
        .select(['team.id AS teamId', 'team.name AS teamName'])
        .orderBy('team.createdAt', 'ASC')
        .getRawMany();

    if (teams.length === 0) {
      return {
        message: '사용자가 속한 팀이 없습니다.',
        data: { teams: [], teamLists: null },
      };
    }

    const firstTeamId = teams[0].teamId;

    const firstTeamLists = await this.teamsRepository
      .createQueryBuilder('team')
      .innerJoinAndSelect('team.todolists', 'todolists')
      .where('team.id = :firstTeamId', { firstTeamId })
      .orderBy('todolists.status', 'ASC')
      .addOrderBy('todolists.id', 'DESC')
      .getOne();

    if (!firstTeamLists || !firstTeamLists.todolists) {
      return {
        message: '해당 팀의 Todo 리스트가 없습니다.',
        data: { teams, teamLists: { teamId: firstTeamId, lists: [] } },
      };
    }

    return {
      message: '사용자 정보가 확인되었습니다.',
      data: {
        teams,
        teamLists: {
          teamId: firstTeamId,
          lists: firstTeamLists.todolists.map((list) => ({
            listId: list.id,
            listName: list.name,
            listStatus: list.status,
          })),
        },
      },
    };
  }
}
