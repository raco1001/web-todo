import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { UpdateListStatusDto } from './dto/update-list-status.dto';
import { Todolists } from '../../entities/Todolists';
import { Teams } from '../../entities/Teams';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(Teams)
    private teamsRepository: Repository<Teams>,

    @InjectRepository(Todolists)
    private todolistsRepository: Repository<Todolists>,
  ) {}

  async createList(createListDto: CreateListDto) {
    const { teamId, listName } = createListDto;

    const existingList = await this.todolistsRepository.findOne({
      where: { name: listName },
    });

    if (existingList) {
      const { id: listId } = existingList;
      const teamListExists = await this.teamsRepository
        .createQueryBuilder('teams')
        .innerJoin('teams.todolists', 'todolist')
        .where('teams.id = :teamId', { teamId })
        .andWhere('todolist.id = :listId', { listId })
        .getOne();

      if (teamListExists) {
        throw new BadRequestException('해당 팀에 해당 리스트가 존재합니다.');
      }
    }

    const newList = this.todolistsRepository.create({
      name: listName,
      status: false,
    });

    const listResult = await this.todolistsRepository.save(newList);

    const { id: listId } = listResult;

    await this.teamsRepository
      .createQueryBuilder()
      .relation('todolists')
      .of(teamId)
      .add(listId);

    return {
      message: '새로운 리스트가 생성되고 팀에 추가되었습니다.',
      data: { teamId, listId: listResult.id },
    };
  }

  findAll() {
    return `This action returns all list`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }
  async updateListName(
    listId: number,
    updateListDto: UpdateListDto,
  ): Promise<{
    data: {
      todo: {
        lists: { listId: number; listName: string; listStatus: boolean }[];
      };
    };
  }> {
    const { listName } = updateListDto;
    console.log(listId);
    // 1. 리스트 이름 업데이트
    await this.todolistsRepository.update(listId, {
      name: listName,
    });

    // 2. 리스트 전체 재조회 (정렬: status ASC, id DESC)
    const todolists = await this.todolistsRepository.find({
      where: { status: false }, // status가 0 (false)인 것만
      order: { id: 'ASC' }, // 최신 리스트 먼저 보기
    });

    // 3. 데이터 변환 (리턴 형식 맞추기)
    const lists = todolists.map((list) => ({
      listId: list.id,
      listName: list.name,
      listStatus: list.status,
    }));

    return {
      data: {
        todo: {
          lists: lists,
        },
      },
    };
  }

  async updateStatus(
    listId: number,
    updateListStatusDto: UpdateListStatusDto,
  ): Promise<{
    message: string;
    data: {
      updatedList: {
        listId: number;
        listName: string;
        listStatus: boolean;
      };
    };
  }> {
    const { status } = updateListStatusDto;
    console.log(status);
    const updateResult = await this.todolistsRepository.update(listId, {
      status,
    });
    console.log(updateResult);
    const updated = await this.todolistsRepository.findOne({
      where: { id: listId },
    });

    return {
      message: `리스트의 상태가 ${status ? '완료됨' : '미완료로 변경됨'}`,
      data: {
        updatedList: {
          listId: updated.id,
          listName: updated.name,
          listStatus: updated.status,
        },
      },
    };
  }

  async removeList(listId: number): Promise<{
    message: string;
    data: {
      todo?: {
        lists: { listId: number; listName: string; listStatus: boolean }[];
      };
      done?: {
        lists: { listId: number; listName: string; listStatus: boolean }[];
      };
    };
  }> {
    console.log(listId);
    const targetList = await this.todolistsRepository.findOne({
      where: { id: listId },
    });

    if (!targetList) {
      throw new NotFoundException(
        `ID가 ${listId}인 리스트를 찾을 수 없습니다.`,
      );
    }

    const targetStatus = targetList.status;

    await this.todolistsRepository.delete({ id: listId });

    const lists = await this.todolistsRepository.find({
      where: { status: targetStatus },
      order: { id: 'DESC' },
    });

    const formattedLists = lists.map((list) => ({
      listId: list.id,
      listName: list.name,
      listStatus: list.status,
    }));

    const statusKey = targetStatus ? 'done' : 'todo';

    return {
      message: `리스트가 삭제되었습니다.`,
      data: {
        [statusKey]: {
          lists: formattedLists,
        },
      },
    };
  }
}
