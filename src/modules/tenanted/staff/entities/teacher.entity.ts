import { AbstractEntity } from 'src/db/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Staff } from './staff.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Classroom } from '../../classrooms/entities/classroom.entity';

@Entity({ name: 'teachers' })
export class Teacher extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  // The highest qualification of the teacher
  @Column({ nullable: true })
  qualification: string;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable()
  subjects: Subject[];

  @Column({ nullable: true })
  employmentType: string; // 'Full-time', 'Part-time', 'Contract'

  @OneToOne(() => Staff)
  @JoinColumn()
  staff: Staff;

  @OneToOne(() => Classroom)
  classroom: Classroom;
}
