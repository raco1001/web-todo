import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todolists } from '../../entities/Todolists';
import { Teams } from '../../entities/Teams';
import { ListService } from './todolists.service';
import { ListController } from './todolists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Todolists, Teams])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
