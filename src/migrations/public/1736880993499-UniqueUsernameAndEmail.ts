import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueUsernameAndEmail1736880993499 implements MigrationInterface {
    name = 'UniqueUsernameAndEmail1736880993499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" ADD CONSTRAINT "UQ_e97523746d4e68fe2ffcf2f6a06" UNIQUE ("username", "email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "UQ_e97523746d4e68fe2ffcf2f6a06"`);
    }

}
