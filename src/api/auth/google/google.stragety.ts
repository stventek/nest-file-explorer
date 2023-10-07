import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthGoogleService } from '../services/auth-google/auth-google.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthGoogleService,
    config: ConfigService,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
      state: true,
    });
  }

  authorizationParams(options: any) {
    return Object.assign(options, {
      prompt: 'select_account',
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    const { id, name, emails } = profile;

    const user = {
      provider: 'google',
      id: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
    };
    return await this.authService.signIn(user);
  }
}
