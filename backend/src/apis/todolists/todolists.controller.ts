import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListService } from './todolists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { UpdateListStatusDto } from './dto/update-list-status.dto';

@Controller('todolists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post('')
  createList(@Body() createListDto: CreateListDto) {
    return this.listService.createList(createListDto);
  }

  @Patch(':listId')
  updateListName(
    @Param('listId') listId: number,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listService.updateListName(listId, updateListDto);
  }

  @Patch(':listId/status')
  updateStatus(
    @Param('listId') listId: number,
    @Body() updateListStatusDto: UpdateListStatusDto,
  ) {
    return this.listService.updateStatus(listId, updateListStatusDto);
  }

  @Delete(':listId')
  removeList(@Param('listId') listId: number) {
    return this.listService.removeList(listId);
  }
}
