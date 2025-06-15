import { Column, Entity, ManyToMany, Unique } from 'typeorm';
import { Subscription } from './subscription.entity';
import { AbstractEntity } from 'src/db/abstract.entity';

@Entity({ name: 'features' })
@Unique(['name'])
export class Feature extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToMany(() => Subscription, (subscription) => subscription.features)
  subscriptions: Subscription[];
}
