import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class UserEmail1749988128019 implements MigrationInterface {
    name = 'UserEmail1749988128019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection
                  .options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."users" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection
                  .options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."users" DROP COLUMN "email"`);
    }

}
