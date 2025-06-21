import { AbstractEntity } from 'src/db/abstract.entity';
import { BeforeInsert, Column, Entity, OneToOne, Unique } from 'typeorm';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { PasswordService } from 'src/passwords/password.service';
import { PickType } from '@nestjs/mapped-types';

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

  @Column({ nullable: true })
  logo: string;

  @Column()
  password: string;

  @OneToOne(() => Subscription, { nullable: true })
  subscriptionPlan: Subscription | null;

  @BeforeInsert()
  async setPassword(password: string) {
    this.password = PasswordService.hashedPassword(password);
  }
}

export class TenantDetails extends PickType(Tenant, [
  'id',
  'username',
  'name',
  'email',
  'address',
  'logo',
]) {}
