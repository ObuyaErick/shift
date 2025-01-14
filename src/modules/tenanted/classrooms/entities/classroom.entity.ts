import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { AbstractEntity } from 'src/lib/abstract.entity';
import { Teacher } from '../../staff/entities/teacher.entity';

@Entity({ name: 'classrooms' })
export class Classroom extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  slug: string;

  @OneToMany(() => Student, (student) => student.classroom)
  students: Student[];

  @OneToOne(() => Teacher)
  @JoinColumn()
  classTeacher: Teacher;
}
