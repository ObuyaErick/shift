import { AbstractEntity } from 'src/lib/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Feature } from './feature.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity({ name: 'tenant_subscriptions' })
export class Subscription extends AbstractEntity {
  @Column()
  renewed: Date;

  @Column()
  active: boolean;

  @Column()
  duration: number;

  @OneToOne(() => Tenant)
  @JoinColumn()
  tenant: Tenant;

  @ManyToMany(() => Feature, (feature) => feature.subscriptions)
  @JoinTable({ name: 'subscription_features' })
  features: Feature[];
}
