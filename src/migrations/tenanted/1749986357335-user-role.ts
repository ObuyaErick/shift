import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class UserRole1749986357335 implements MigrationInterface {
    name = 'UserRole1749986357335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection
          .options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."classrooms" ADD "grade_level" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection
          .options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."classrooms" DROP COLUMN "grade_level"`);
    }

}
