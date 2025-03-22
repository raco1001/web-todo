import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Teams } from './Teams';

@Entity('todolists', { schema: 'todolist' })
export class Todolists {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('tinyint', {
    name: 'status',
    nullable: false,
    default: () => '0',
    width: 1,
  })
  status: boolean;

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

  @ManyToMany(() => Teams, (teams) => teams.todolists)
  teams: Teams[];
}
