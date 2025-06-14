import { Column, Entity, ManyToMany, Unique } from 'typeorm';
import { Subscription } from './subscription.entity';
import { AbstractEntity } from 'src/lib/abstract.entity';

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

// export enum TenancyFeatures {
//   SIS = "student_information_system",
//   Timetabling = "timetabling",

// }

// In my multitenant application, I have a public set of entities majorly the Tenant model. All other business models are glued together using schema based multitenancy. Each tenant with its own schema but same set of models. I am looking forward to creating an authentication/authorization logic where a tenant's users can login and access resources within the scope of the Tenant (I plan on using casl library for this as it is a nestjs saas multitenant application), there should be also a way some user within the tenant scope has administrative access for the tenant's resources, and I also intend to provide access

// 8.30 -> Stand Up

// FIRE BASE
// Basic Integrations
