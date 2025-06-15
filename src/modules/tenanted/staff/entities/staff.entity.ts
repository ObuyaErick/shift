import { Column, Entity, OneToOne } from 'typeorm';
import { Teacher } from './teacher.entity';
import { SupportStaff } from './support-staff.entity';
import { AbstractEntity } from 'src/db/abstract.entity';

// export enum StaffRoles {
//   Principal = 'Principal',
//   DeputyPrincipal = 'DeputyPrincipal',
// }

@Entity({ name: 'staff' })
export class Staff extends AbstractEntity {
  @Column()
  role: string;

  @OneToOne(() => Teacher)
  teacher: Teacher;

  @OneToOne(() => SupportStaff)
  supportStaff: SupportStaff;
}
