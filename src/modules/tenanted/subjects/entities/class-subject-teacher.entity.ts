import { AbstractEntity } from 'src/db/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from '../../staff/entities/teacher.entity';
import { Classroom } from '../../classrooms/entities/classroom.entity';

@Entity({ name: 'subject_class_teachers' })
@Unique(['subjectId', 'classRoomId', 'teacherId']) // Ensure unique combination
export class SubjectClassTeacher extends AbstractEntity {
  @ManyToOne(() => Subject, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @ManyToOne(() => Teacher, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  subjectTeacher: Teacher;

  @ManyToOne(() => Classroom, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classRoomId' })
  classroom: Classroom;

  @Column()
  subjectId: number;

  @Column()
  teacherId: number;

  @Column()
  classRoomId: number;
}
