import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todolists } from '../../entities/Todolists';
import { Teams } from '../../entities/Teams';
import { TeamUsers } from '../../entities/TeamUsers';
import { Users } from '../../entities/Users';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Teams, TeamUsers, Todolists, Users])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
