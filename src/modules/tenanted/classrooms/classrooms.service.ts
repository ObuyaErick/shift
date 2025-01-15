import { Inject, Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Classroom } from './entities/classroom.entity';
import { Connection, Repository } from 'typeorm';
import { TENANT_CONNECTION } from 'src/modules/tenancy/tenancy.symbols';
import { Teacher } from '../staff/entities/teacher.entity';
import { Crud } from 'src/lib/crud';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class ClassroomsService {
  private readonly classroomsRepository: Repository<Classroom>;

  constructor(
    @Inject(TENANT_CONNECTION) private readonly tenantConnection: Connection,
    private readonly staffService: StaffService,
  ) {
    this.classroomsRepository = tenantConnection.getRepository(Classroom);
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

  async remove(id: string) {
    return this.classroomsRepository.remove(await this.findOne(id));
  }
}
