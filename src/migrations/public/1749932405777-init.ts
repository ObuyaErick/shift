import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1749932405777 implements MigrationInterface {
    name = 'Init1749932405777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "UQ_bcc3a344ae156a9fba128e1cb4d" UNIQUE ("name"), CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "renewed" TIMESTAMP NOT NULL, "active" boolean NOT NULL, "duration" integer NOT NULL, "tenant_id" uuid, CONSTRAINT "REL_c59c97d5c1343951e044c137f0" UNIQUE ("tenant_id"), CONSTRAINT "PK_9455f2b3b10365e81538a079da3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, "logo" character varying, CONSTRAINT "UQ_e97523746d4e68fe2ffcf2f6a06" UNIQUE ("username", "email"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feature_subscriptions" ("tenant_subscriptions_id" uuid NOT NULL, "features_id" uuid NOT NULL, CONSTRAINT "PK_ff19025ae931b7a46def247e164" PRIMARY KEY ("tenant_subscriptions_id", "features_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ca88dbc149d78f6bcd4fce052" ON "feature_subscriptions" ("tenant_subscriptions_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac338582d0f714f224b5ed49c0" ON "feature_subscriptions" ("features_id") `);
        await queryRunner.query(`ALTER TABLE "tenant_subscriptions" ADD CONSTRAINT "FK_c59c97d5c1343951e044c137f02" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature_subscriptions" ADD CONSTRAINT "FK_3ca88dbc149d78f6bcd4fce052f" FOREIGN KEY ("tenant_subscriptions_id") REFERENCES "tenant_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "feature_subscriptions" ADD CONSTRAINT "FK_ac338582d0f714f224b5ed49c07" FOREIGN KEY ("features_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature_subscriptions" DROP CONSTRAINT "FK_ac338582d0f714f224b5ed49c07"`);
        await queryRunner.query(`ALTER TABLE "feature_subscriptions" DROP CONSTRAINT "FK_3ca88dbc149d78f6bcd4fce052f"`);
        await queryRunner.query(`ALTER TABLE "tenant_subscriptions" DROP CONSTRAINT "FK_c59c97d5c1343951e044c137f02"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac338582d0f714f224b5ed49c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ca88dbc149d78f6bcd4fce052"`);
        await queryRunner.query(`DROP TABLE "feature_subscriptions"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "tenant_subscriptions"`);
        await queryRunner.query(`DROP TABLE "features"`);
    }

}
