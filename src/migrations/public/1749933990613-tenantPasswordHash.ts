import { MigrationInterface, QueryRunner } from "typeorm";

export class TenantPasswordHash1749933990613 implements MigrationInterface {
    name = 'TenantPasswordHash1749933990613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "password"`);
    }

}
