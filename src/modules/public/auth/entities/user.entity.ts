import { AbstractEntity } from 'src/lib/abstract.entity';
import { Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends AbstractEntity {}
