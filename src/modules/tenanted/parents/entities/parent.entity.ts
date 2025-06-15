import { AbstractEntity } from 'src/db/abstract.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity({ name: 'parents' })
export class Parent extends AbstractEntity {
  @Column()
  privilege: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @ManyToMany(() => Student, (student) => student.parents)
  students: Student[];
}
