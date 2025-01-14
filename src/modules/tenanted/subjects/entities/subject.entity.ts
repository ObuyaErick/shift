import { AbstractEntity } from 'src/lib/abstract.entity';
import { Entity, ManyToMany } from 'typeorm';
import { Teacher } from '../../staff/entities/teacher.entity';

@Entity({ name: 'subjects' })
export class Subject extends AbstractEntity {
  name: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];
}
