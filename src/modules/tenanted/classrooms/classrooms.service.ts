import { Inject, Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import {
  AssignClassTeacherDto,
  UpdateClassroomDto,
} from './dto/update-classroom.dto';
import { Classroom } from './entities/classroom.entity';
import { DataSource, Repository } from 'typeorm';
import { TENANT_DATASOURCE } from 'src/modules/tenancy/tenancy.symbols';
import { Teacher } from '../staff/entities/teacher.entity';
import { StaffService } from '../staff/staff.service';
import { Crud } from 'src/db/crud';

@Injectable()
export class ClassroomsService {
  private readonly classroomsRepository: Repository<Classroom>;

  constructor(
    @Inject(TENANT_DATASOURCE) private readonly tenantDatasource: DataSource,
    private readonly staffService: StaffService,
  ) {
    this.classroomsRepository = tenantDatasource.getRepository(Classroom);
  }

  async create(createClassroomDto: CreateClassroomDto) {
    const { classTeacherId, ...createData } = createClassroomDto;
    let classTeacher: Teacher | null = null;
    if (classTeacherId) {
      classTeacher = await this.staffService
        .findOneTeacher(classTeacherId)
        .catch(() => null);
    }

    return this.classroomsRepository.save({ ...createData, classTeacher });
  }

  findAll() {
    return this.classroomsRepository.find();
  }

  findOne(id: string) {
    return Crud.find(this.classroomsRepository, { id });
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    await this.findOne(id);
    return this.classroomsRepository.update({ id }, updateClassroomDto);
  }

  async assignClassTeacher(assignClassTeacherDto: AssignClassTeacherDto) {
    const classroom = await this.findOne(assignClassTeacherDto.classroomId);
    const teacher = await this.staffService.findOneTeacher(
      assignClassTeacherDto.classTeacherId,
    );
    classroom.classTeacher = teacher;
    return await this.classroomsRepository.save(classroom);
  }

  async remove(id: string) {
    return this.classroomsRepository.remove(await this.findOne(id));
  }
}
