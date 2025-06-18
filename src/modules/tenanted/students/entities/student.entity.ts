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
import { Classroom } from '../../classrooms/entities/classroom.entity';
import { Parent } from '../../parents/entities/parent.entity';
import { User } from '../../users/entities/user.entity';
import { Gender } from '../../gender.enum';
import { IsEnum } from 'class-validator';

@Entity({ name: 'students' })
export class Student extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  surname: string;

  @Column()
  @IsEnum(Gender)
  gender: Gender;

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
