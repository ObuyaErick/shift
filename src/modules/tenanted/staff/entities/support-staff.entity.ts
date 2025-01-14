import { AbstractEntity } from 'src/lib/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Staff } from './staff.entity';

@Entity({ name: 'support_staff' })
export class SupportStaff extends AbstractEntity {
  @OneToOne(() => Staff)
  @JoinColumn()
  staff: Staff;

  // Department or area of support
  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  role: string;

  // Employment type
  @Column({ nullable: true })
  employmentType: string; // Full-time, Part-time, Temporary

  // Date of joining the support staff role
  @Column({ type: 'date', nullable: true })
  joinedAt: Date;

  // Additional notes or remarks about the support staff
  @Column({ type: 'text', nullable: true })
  remarks: string;

  // Skills relevant to support role
  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  contactNumber: string;

  @Column({ nullable: true })
  address: string;
}
