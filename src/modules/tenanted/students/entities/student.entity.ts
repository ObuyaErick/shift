import { AbstractEntity } from 'src/lib/abstract.entity';
import { Column, Entity } from 'typeorm';

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
}
