import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class UniqueOtpAndAddValueColumn1750058447712 implements MigrationInterface {
    name = 'UniqueOtpAndAddValueColumn1750058447712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection
                          .options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."one_time_passwords" ADD "value" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection
                          .options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."one_time_passwords" DROP COLUMN "value"`);
    }

}
