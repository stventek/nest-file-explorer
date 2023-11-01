import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/services/typeorm/typeorm.service';
import { RedisModule } from './redis/redis.module';
import { REDIS } from './redis/redis.constants';
import RedisStore from 'connect-redis';
import { RedisClientType } from 'redis';
import * as session from 'express-session';
import * as passport from 'passport';

const envFilePath: string = getEnvPath(`${__dirname}/../common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
    SharedModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(REDIS) private readonly redis: RedisClientType,
    private config: ConfigService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new RedisStore({ client: this.redis }),
          saveUninitialized: false,
          secret: this.config.get<string>('SECRET'),
          resave: false,
          cookie: {
            sameSite: 'lax',
            secure:
              this.config.get<string>('NODE_ENV') === 'production'
                ? true
                : false,
            httpOnly: true,
            maxAge: +this.config.get<number>('SESSION_AGE'),
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
