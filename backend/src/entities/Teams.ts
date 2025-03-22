import {
  Column,
  Entity,
  JoinTable,
  PrimaryColumn,
  ManyToMany,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Todolists } from './Todolists';
import { TeamUsers } from './TeamUsers';
import { v4 as uuidv4 } from 'uuid';

@Entity('teams', { schema: 'todolist' })
export class Teams {
  @PrimaryColumn('char', { primary: true, name: 'id', length: 36 })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @ManyToMany(() => Todolists, (todolists) => todolists.teams)
  @JoinTable({
    name: 'team_lists',
    joinColumns: [{ name: 'team_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'list_id', referencedColumnName: 'id' }],
    schema: 'todolist',
  })
  todolists: Todolists[];

  @OneToMany(() => TeamUsers, (teamUsers) => teamUsers.teams)
  teamUsers: TeamUsers[];

  @BeforeInsert()
  generateUUID() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
