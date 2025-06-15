import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class Init1749981128199 implements MigrationInterface {
    name = 'Init1749981128199'

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
