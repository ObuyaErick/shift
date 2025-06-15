import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TENANT_DATASOURCE } from 'src/modules/tenancy/tenancy.symbols';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly usersRepository: Repository<User>;

  constructor(
    @Inject(TENANT_DATASOURCE)
    private readonly tenantDataSource: DataSource,
  ) {
    this.usersRepository = tenantDataSource.getRepository(User);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    return await this.usersRepository.findOneOrFail({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
