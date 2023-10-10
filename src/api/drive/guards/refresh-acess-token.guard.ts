import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { FederatedKeys } from 'src/api/cloud-storage-auth/entities/federated-credentials.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshAccessTokenGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    @InjectRepository(FederatedKeys)
    private readonly federatedKeysRepository: Repository<FederatedKeys>,
  ) {}

  hasExpired(unixTimeInMs: number) {
    const currentTimeInMs = Date.now();
    return unixTimeInMs <= currentTimeInMs;
  }

  async refreshToken(refreshToken: string) {
    const oauth2Client = new OAuth2Client({
      clientId: this.config.get<string>('DRIVE_CLIENT_ID'),
      clientSecret: this.config.get<string>('DRIVE_CLIENT_SECRET'),
      credentials: { refresh_token: refreshToken },
    });
    return oauth2Client.refreshAccessToken();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const federatedKeysRecord = await this.federatedKeysRepository.findOne({
      where: { user: { id: request.user.id } },
    });
    if (!federatedKeysRecord)
      throw new UnauthorizedException('Google drive requires authorization');
    if (this.hasExpired(Number(federatedKeysRecord.expiry_date))) {
      try {
        const credentials = await this.refreshToken(
          federatedKeysRecord.refreshToken,
        );
        federatedKeysRecord.accessToken = credentials.credentials.access_token;
        federatedKeysRecord.expiry_date =
          credentials.credentials.expiry_date.toString();
        await this.federatedKeysRepository.save(federatedKeysRecord);
      } catch (error) {
        if (error.message === 'Invalid Credentials') {
          throw new UnauthorizedException(
            'Google drive requires authorization',
          );
        } else {
          throw new Error('Failed to refresh access token: ' + error.message);
        }
      }
    }
    request.accessToken = federatedKeysRecord.accessToken;
    return true;
  }
}
