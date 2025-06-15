import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { AbstractEntity } from 'src/db/abstract.entity';
import { Teacher } from '../../staff/entities/teacher.entity';

@Entity({ name: 'classrooms' })
@Unique(['slug'])
export class Classroom extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  gradeLevel: string;

  @OneToMany(() => Student, (student) => student.classroom)
  students: Student[];

  @OneToOne(() => Teacher, { nullable: true })
  @JoinColumn()
  classTeacher: Teacher | null;
}
