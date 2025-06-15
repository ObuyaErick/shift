import { Inject, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher-dto';
import { DataSource, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { Teacher } from './entities/teacher.entity';
import { TENANT_DATASOURCE } from 'src/modules/tenancy/tenancy.symbols';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Crud } from 'src/db/crud';

@Injectable()
export class StaffService {
  private readonly staffRepository: Repository<Staff>;
  private readonly teacherRepository: Repository<Teacher>;

  constructor(
    @Inject(TENANT_DATASOURCE) private readonly tenantDatasource: DataSource
  ) {
    this.staffRepository = tenantDatasource.getRepository(Staff);
    this.teacherRepository = tenantDatasource.getRepository(Teacher);
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const entityManager = this.tenantDatasource.createEntityManager();
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
