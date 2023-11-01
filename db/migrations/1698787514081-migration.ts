import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698787514081 implements MigrationInterface {
    name = 'Migration1698787514081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying, "username" character varying NOT NULL, "name" character varying NOT NULL, "lastLoginAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "federated_credentials" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "provider" character varying NOT NULL, "subject" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_501998c0f03c831ecc9b16a1976" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "federated_keys" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "provider" character varying NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expiry_date" bigint NOT NULL, "userId" integer, CONSTRAINT "UQ_e64b0d5e5b9ffaa902a69e07b40" UNIQUE ("provider", "userId"), CONSTRAINT "PK_b6b16c167685593411097696b1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "federated_credentials" ADD CONSTRAINT "FK_c6fd37ce4b2ed644db43c933d73" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "federated_keys" ADD CONSTRAINT "FK_26958394ec31d2db4ff02813eff" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "federated_keys" DROP CONSTRAINT "FK_26958394ec31d2db4ff02813eff"`);
        await queryRunner.query(`ALTER TABLE "federated_credentials" DROP CONSTRAINT "FK_c6fd37ce4b2ed644db43c933d73"`);
        await queryRunner.query(`DROP TABLE "federated_keys"`);
        await queryRunner.query(`DROP TABLE "federated_credentials"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
