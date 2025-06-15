import { AbstractEntity } from 'src/db/abstract.entity';
import { Column, Entity, Index, JoinColumn, OneToOne, Unique } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity({ name: 'one_time_passwords' })
@Unique(['user_id'])
export class OTP extends AbstractEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  value: string;
}
