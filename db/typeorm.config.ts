import { config } from 'dotenv';
import { getEnvPath } from '../src/common/helper/env.helper';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const envFilePath: string = getEnvPath(`${__dirname}/../src/common/envs`);
config({ path: envFilePath });

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  database: configService.get<string>('DATABASE_NAME'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'typeorm_migrations',
  logger: 'file',
  synchronize: false, // never use TRUE in production!
  logging: false,
});
