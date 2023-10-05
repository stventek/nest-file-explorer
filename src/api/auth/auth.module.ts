import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.stragety';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthSerializer } from './serialization.provider';
import { LoggedInGuard } from './guards/logged-in.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { FederatedCredentials } from './entities/federated-credentials.entity';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    AuthSerializer,
    LoggedInGuard,
    GoogleOauthGuard,
  ],
  imports: [
    TypeOrmModule.forFeature([User, FederatedCredentials]),
    PassportModule.register({ defaultStrategy: 'google', property: 'user' }),
  ],
})
export class AuthModule {}
