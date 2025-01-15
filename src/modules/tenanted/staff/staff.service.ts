import { Inject, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher-dto';
import { Connection, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { Teacher } from './entities/teacher.entity';
import { TENANT_CONNECTION } from 'src/modules/tenancy/tenancy.symbols';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Crud } from 'src/lib/crud';

@Injectable()
export class StaffService {
  private readonly staffRepository: Repository<Staff>;
  private readonly teacherRepository: Repository<Teacher>;

  constructor(
    @Inject(TENANT_CONNECTION) private readonly tenantConnection: Connection,
  ) {
    this.staffRepository = tenantConnection.getRepository(Staff);
    this.teacherRepository = tenantConnection.getRepository(Teacher);
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const entityManager = this.tenantConnection.createEntityManager();
    return entityManager.transaction(async (manager) => {
      const staff = await manager.save(
        Staff,
        manager.create(Staff, { role: 'teacher' }),
      );
      let teacher = manager.create(Teacher, { ...createTeacherDto, staff });
      teacher = await manager.save(Teacher, teacher);

      return teacher;
    });
  }

  findAllTeachers() {
    return this.teacherRepository.find();
  }

  findOneTeacher(id: string) {
    return Crud.find(this.teacherRepository, { id });
  }

  async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto) {
    await this.findOneTeacher(id);
    return this.teacherRepository.update({ id }, updateTeacherDto);
  }

  async removeTeacher(id: string) {
    return this.teacherRepository.remove(await this.findOneTeacher(id));
  }
}
