import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsVerifiedToUser1774451599008 implements MigrationInterface {
    name = 'AddIsVerifiedToUser1774451599008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
    }

}
