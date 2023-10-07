import { Module } from '@nestjs/common';
import { CloudStorageAuthController } from './cloud-storage-auth.controller';
import { GoogleDriveService } from './services/google-drive/google-drive.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FederatedCredentials } from '../auth/entities/federated-credentials.entity';
import { FederatedKeys } from './entities/federated-credentials.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CloudStorageAuthController],
  providers: [GoogleDriveService],
  imports: [
    TypeOrmModule.forFeature([User, FederatedCredentials, FederatedKeys]),
    AuthModule,
  ],
})
export class CloudStorageAuthModule {}
