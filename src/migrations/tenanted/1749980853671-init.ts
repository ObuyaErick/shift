import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class Init1749980853671 implements MigrationInterface {
    name = 'Init1749980853671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection
          .options as PostgresConnectionOptions;
        await queryRunner.query(`CREATE TABLE "${schema}"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."one_time_passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_26150fcf25cfa393abc183e9ba" UNIQUE ("user_id"), CONSTRAINT "PK_950f90e67e1a84f5c06b622161e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."support_staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "department" character varying, "role" character varying, "employment_type" character varying, "joined_at" date, "remarks" text, "skills" text, "contact_number" character varying, "address" character varying, "staff_id" uuid, CONSTRAINT "REL_9589fc6bddb874f0636a93294c" UNIQUE ("staff_id"), CONSTRAINT "PK_242e71f6887c0bea424952a345b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role" character varying NOT NULL, CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."parents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "privilege" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_9a4dc67c7b8e6a9cb918938d353" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "surname" character varying NOT NULL, "gender" character varying NOT NULL, "date_of_birth" character varying NOT NULL, "user_id" uuid, "classroom_id" uuid, CONSTRAINT "REL_fb3eff90b11bddf7285f9b4e28" UNIQUE ("user_id"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."classrooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "class_teacher_id" uuid, CONSTRAINT "UQ_a86e95bf8220f395a2319c034e7" UNIQUE ("slug"), CONSTRAINT "REL_d0fcf456f4325ffb522e6154cd" UNIQUE ("class_teacher_id"), CONSTRAINT "PK_20b7b82896c06eda27548bd0c24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "qualification" character varying, "employment_type" character varying, "staff_id" uuid, CONSTRAINT "REL_f7bf337e13f8f29340979df007" UNIQUE ("staff_id"), CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."subjects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."subject_class_teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "subject_id" integer NOT NULL, "teacher_id" integer NOT NULL, "class_room_id" integer NOT NULL, "subjectId" uuid NOT NULL, "teacherId" uuid NOT NULL, "classRoomId" uuid NOT NULL, CONSTRAINT "UQ_665f94e32399fa9711391901a1c" UNIQUE ("subject_id", "class_room_id", "teacher_id"), CONSTRAINT "PK_e429d0143943d3ed586e4ecd7b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."students_parents_parents" ("students_id" uuid NOT NULL, "parents_id" uuid NOT NULL, CONSTRAINT "PK_4d8b1e219358742af08fb4ab0e8" PRIMARY KEY ("students_id", "parents_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_15eee1072c94c35dae413db9c3" ON "${schema}"."students_parents_parents" ("students_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_99a40cf720ac0ebc6c9334c69a" ON "${schema}"."students_parents_parents" ("parents_id") `);
        await queryRunner.query(`CREATE TABLE "${schema}"."teachers_subjects_subjects" ("teachers_id" uuid NOT NULL, "subjects_id" uuid NOT NULL, CONSTRAINT "PK_4aa88f026b06a168d6da49a220e" PRIMARY KEY ("teachers_id", "subjects_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe8e1d7503678c801c09b8ee49" ON "${schema}"."teachers_subjects_subjects" ("teachers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d00a0edc5562704a554d3a67b0" ON "${schema}"."teachers_subjects_subjects" ("subjects_id") `);
        await queryRunner.query(`ALTER TABLE "${schema}"."one_time_passwords" ADD CONSTRAINT "FK_26150fcf25cfa393abc183e9ba7" FOREIGN KEY ("user_id") REFERENCES "${schema}"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."support_staff" ADD CONSTRAINT "FK_9589fc6bddb874f0636a93294c3" FOREIGN KEY ("staff_id") REFERENCES "${schema}"."staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."students" ADD CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281" FOREIGN KEY ("user_id") REFERENCES "${schema}"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."students" ADD CONSTRAINT "FK_b6f55adbe6f4e4d994549117071" FOREIGN KEY ("classroom_id") REFERENCES "${schema}"."classrooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."classrooms" ADD CONSTRAINT "FK_d0fcf456f4325ffb522e6154cd0" FOREIGN KEY ("class_teacher_id") REFERENCES "${schema}"."teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."teachers" ADD CONSTRAINT "FK_f7bf337e13f8f29340979df0079" FOREIGN KEY ("staff_id") REFERENCES "${schema}"."staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."subject_class_teachers" ADD CONSTRAINT "FK_4ff5a8c6f49ea044abcb3d7bbba" FOREIGN KEY ("subjectId") REFERENCES "${schema}"."subjects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."subject_class_teachers" ADD CONSTRAINT "FK_3ccbf99012ffd80e6e5bc00fe64" FOREIGN KEY ("teacherId") REFERENCES "${schema}"."teachers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."subject_class_teachers" ADD CONSTRAINT "FK_87e530b3a2fb0b6783e63219949" FOREIGN KEY ("classRoomId") REFERENCES "${schema}"."classrooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."students_parents_parents" ADD CONSTRAINT "FK_15eee1072c94c35dae413db9c3c" FOREIGN KEY ("students_id") REFERENCES "${schema}"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "${schema}"."students_parents_parents" ADD CONSTRAINT "FK_99a40cf720ac0ebc6c9334c69a4" FOREIGN KEY ("parents_id") REFERENCES "${schema}"."parents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."teachers_subjects_subjects" ADD CONSTRAINT "FK_fe8e1d7503678c801c09b8ee494" FOREIGN KEY ("teachers_id") REFERENCES "${schema}"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "${schema}"."teachers_subjects_subjects" ADD CONSTRAINT "FK_d00a0edc5562704a554d3a67b01" FOREIGN KEY ("subjects_id") REFERENCES "${schema}"."subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection
          .options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."teachers_subjects_subjects" DROP CONSTRAINT "FK_d00a0edc5562704a554d3a67b01"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."teachers_subjects_subjects" DROP CONSTRAINT "FK_fe8e1d7503678c801c09b8ee494"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."students_parents_parents" DROP CONSTRAINT "FK_99a40cf720ac0ebc6c9334c69a4"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."students_parents_parents" DROP CONSTRAINT "FK_15eee1072c94c35dae413db9c3c"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."subject_class_teachers" DROP CONSTRAINT "FK_87e530b3a2fb0b6783e63219949"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."subject_class_teachers" DROP CONSTRAINT "FK_3ccbf99012ffd80e6e5bc00fe64"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."subject_class_teachers" DROP CONSTRAINT "FK_4ff5a8c6f49ea044abcb3d7bbba"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."teachers" DROP CONSTRAINT "FK_f7bf337e13f8f29340979df0079"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."classrooms" DROP CONSTRAINT "FK_d0fcf456f4325ffb522e6154cd0"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."students" DROP CONSTRAINT "FK_b6f55adbe6f4e4d994549117071"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."students" DROP CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."support_staff" DROP CONSTRAINT "FK_9589fc6bddb874f0636a93294c3"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."one_time_passwords" DROP CONSTRAINT "FK_26150fcf25cfa393abc183e9ba7"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_d00a0edc5562704a554d3a67b0"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_fe8e1d7503678c801c09b8ee49"`);
        await queryRunner.query(`DROP TABLE "${schema}"."teachers_subjects_subjects"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_99a40cf720ac0ebc6c9334c69a"`);
        await queryRunner.query(`DROP INDEX "${schema}"."IDX_15eee1072c94c35dae413db9c3"`);
        await queryRunner.query(`DROP TABLE "${schema}"."students_parents_parents"`);
        await queryRunner.query(`DROP TABLE "${schema}"."subject_class_teachers"`);
        await queryRunner.query(`DROP TABLE "${schema}"."subjects"`);
        await queryRunner.query(`DROP TABLE "${schema}"."teachers"`);
        await queryRunner.query(`DROP TABLE "${schema}"."classrooms"`);
        await queryRunner.query(`DROP TABLE "${schema}"."students"`);
        await queryRunner.query(`DROP TABLE "${schema}"."parents"`);
        await queryRunner.query(`DROP TABLE "${schema}"."staff"`);
        await queryRunner.query(`DROP TABLE "${schema}"."support_staff"`);
        await queryRunner.query(`DROP TABLE "${schema}"."one_time_passwords"`);
        await queryRunner.query(`DROP TABLE "${schema}"."users"`);
    }

}
