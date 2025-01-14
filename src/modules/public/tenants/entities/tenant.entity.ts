import { AbstractEntity } from 'src/lib/abstract.entity';
import { Column, Entity, Unique } from 'typeorm';

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
}
