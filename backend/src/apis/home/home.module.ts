import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from '../../entities/Teams';
import { TeamUsers } from '../../entities/TeamUsers';
import { Todolists } from '../../entities/Todolists';
import { Users } from '../../entities/Users';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Todolists, Users, Teams, TeamUsers])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
