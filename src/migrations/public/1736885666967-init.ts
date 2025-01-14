import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTenantPassword1736885666967 implements MigrationInterface {
    name = 'AddedTenantPassword1736885666967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, "logo" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e97523746d4e68fe2ffcf2f6a06" UNIQUE ("username", "email"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenants"`);
    }

}
