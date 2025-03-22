import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './Users';
import { Teams } from './Teams';

@Index('FK_users_TO_team_users_1', ['userId'], {})
@Entity('team_users', { schema: 'todolist' })
export class TeamUsers {
  @PrimaryColumn('char', { primary: true, name: 'team_id', length: 36 })
  teamId: string;

  @PrimaryColumn('char', { primary: true, name: 'user_id', length: 36 })
  userId: string;

  @Column('varchar', { name: 'role', nullable: true, length: 50 })
  role: string | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @ManyToOne(() => Users, (users) => users.teamUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @ManyToOne(() => Teams, (teams) => teams.teamUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'team_id', referencedColumnName: 'id' }])
  teams: Teams;
}
