import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ReadTeamTodolistDto } from './dto/read-team-todolists.dto';
import { DeleteTeamDto } from './dto/delete-team.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { DeleteMemberDto } from './dto/delete-member.dto';
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/:teamId/todolists')
  async findTeamTodolists(
    @Param('teamId') readTeamTodolistDto: ReadTeamTodolistDto,
  ) {
    return this.teamService.findTeamTodolists(readTeamTodolistDto);
  }

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.createTeam(createTeamDto);
  }

  @Patch(':teamId')
  updateTeamName(
    @Param('teamId') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.updateTeamName(id, updateTeamDto);
  }

  @Delete('')
  removeTeam(@Query() deleteTeamDto: DeleteTeamDto) {
    return this.teamService.removeTeam(deleteTeamDto);
  }

  @Get(':teamId/members')
  findTeamMembers(@Param('teamId') teamId: string) {
    return this.teamService.findTeamMembers(teamId);
  }

  @Post(':teamId/members')
  addTeamMember(
    @Param('teamId') teamId: string,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.teamService.addTeamMember(teamId, createMemberDto);
  }

  @Delete(':teamId/members')
  removeTeamMember(
    @Param('teamId') teamId: string,
    @Body() deleteMemberDto: DeleteMemberDto,
  ) {
    return this.teamService.removeTeamMember(teamId, deleteMemberDto);
  }
}
