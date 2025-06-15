import { AbstractEntity } from 'src/db/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../../user.entity';
import { Classroom } from '../../classrooms/entities/classroom.entity';
import { Parent } from '../../parents/entities/parent.entity';

@Entity({ name: 'students' })
export class Student extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  surname: string;

  @Column()
  gender: string;

  @Column()
  dateOfBirth: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Classroom, (classroom) => classroom.students)
  @JoinColumn()
  classroom: Classroom;

  @ManyToMany(() => Parent, (parent) => parent.students)
  @JoinTable()
  parents: Parent[];
}
