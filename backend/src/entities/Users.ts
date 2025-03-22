import {
  Column,
  Entity,
  PrimaryColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { TeamUsers } from './TeamUsers';
import { v4 as uuidv4 } from 'uuid';

@Entity('users', { schema: 'todolist' })
export class Users {
  @PrimaryColumn('char', { primary: true, name: 'id', length: 36 })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('varchar', { name: 'password', nullable: true, length: 255 })
  password: string | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @OneToMany(() => TeamUsers, (teamUsers) => teamUsers.user)
  teamUsers: TeamUsers[];

  @BeforeInsert()
  generateUUID() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
