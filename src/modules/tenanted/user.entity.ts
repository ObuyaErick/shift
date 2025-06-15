import { AbstractEntity } from 'src/db/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column()
  username: string;

  @Column()
  password: string;
}
