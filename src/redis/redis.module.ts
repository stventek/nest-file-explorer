import { Module } from '@nestjs/common';
import * as Redis from 'redis';

import { REDIS } from './redis.constants';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async (config: ConfigService) => {
        const password = config.get<string>('REDIS_PASSWORD');
        const host = config.get<string>('REDIS_HOST');
        const client = Redis.createClient({
          url: `redis://:${password}@${host}:6379`,
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
