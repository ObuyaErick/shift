import { AbstractEntity } from 'src/lib/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tenants' })
export class Tenant extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  logo: string;
}
