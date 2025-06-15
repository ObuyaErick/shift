import { AbstractEntity } from 'src/db/abstract.entity';
import { Column, Entity } from 'typeorm';

export enum UserRole {
  school = 'school',
  teacher = 'teacher',
  student = 'student',
  parent = 'parent',
}

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
