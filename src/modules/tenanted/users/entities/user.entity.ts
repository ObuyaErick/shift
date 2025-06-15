import { AbstractEntity } from 'src/db/abstract.entity';
import { PasswordService } from 'src/passwords/password.service';
import { BeforeInsert, Column, Entity, Unique } from 'typeorm';

export enum UserRole {
  school = 'school',
  teacher = 'teacher',
  student = 'student',
  parent = 'parent',
}

@Entity({ name: 'users' })
@Unique(['username'])
export class User extends AbstractEntity {
  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @BeforeInsert()
  async setPassword(password: string) {
    this.password = PasswordService.hashedPassword(password);
  }
}
