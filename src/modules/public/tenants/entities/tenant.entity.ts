import { AbstractEntity } from 'src/lib/abstract.entity';
import { Column, Entity, OneToOne, Unique } from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Entity({ name: 'tenants' })
@Unique(['username', 'email'])
export class Tenant extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  logo: string;

  @OneToOne(() => Subscription, { nullable: true })
  subscriptionPlan: Subscription | null;
}
