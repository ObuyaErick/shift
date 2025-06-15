import { AbstractEntity } from 'src/db/abstract.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user.entity';

@Entity({ name: 'one_time_passwords' })
export class OTP extends AbstractEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  value: string;
}
