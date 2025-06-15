import { NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export class Crud {
  public static async find<T extends ObjectLiteral>(
    repository: Repository<T>,
    findOptions: FindOptionsWhere<T>,
  ) {
    try {
      return await repository.findOneByOrFail(findOptions);
    } catch {
      throw new NotFoundException(`${repository.metadata.name} not found`);
    }
  }
}
