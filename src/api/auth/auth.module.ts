import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google/google.stragety';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthSerializer } from './google/serialization.provider';
import { LoggedInGuard } from './guards/logged-in.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { FederatedCredentials } from './entities/federated-credentials.entity';
import { AuthLocalService } from './services/auth-local/auth-local.service';
import { LocalGuard } from './guards/local.guard';
import { LocalStrategy } from './local/local.stragety';
import { AuthGoogleService } from './services/auth-google/auth-google.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    LocalStrategy,
    AuthSerializer,
    LoggedInGuard,
    GoogleOauthGuard,
    LocalGuard,
    AuthLocalService,
    AuthGoogleService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, FederatedCredentials]),
    PassportModule.register({ defaultStrategy: 'google', property: 'user' }),
  ],
})
export class AuthModule {}
