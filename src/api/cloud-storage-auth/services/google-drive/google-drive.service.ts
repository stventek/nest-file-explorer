import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FederatedKeys } from '../../entities/federated-credentials.entity';
import { User } from 'src/api/user/entities/user.entity';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleDriveService {
  oauth2Client: OAuth2Client;

  constructor(
    private config: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(FederatedKeys)
    private readonly federatedKeysRepository: Repository<FederatedKeys>,
  ) {
    this.oauth2Client = new OAuth2Client({
      clientId: this.config.get<string>('DRIVE_CLIENT_ID'),
      clientSecret: this.config.get<string>('DRIVE_CLIENT_SECRET'),
      redirectUri: this.config.get<string>('DRIVE_CALLBACK_URL'),
    });
  }

  getLoginURL(state: string) {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.readonly'],
      state: state,
      prompt: 'consent',
    });
    return authUrl;
  }

  async registerFederatedKeys(code: string, user: User) {
    const { tokens } = await this.oauth2Client.getToken(code);
    // added updatedAt since a typeorm bug doesn't update it automatically, issue #9015
    const federatedKeys = {
      user: { id: user.id },
      provider: 'drive',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      updatedAt: new Date(),
    };
    return this.federatedKeysRepository.upsert(federatedKeys, [
      'user',
      'provider',
    ]);
  }
}
