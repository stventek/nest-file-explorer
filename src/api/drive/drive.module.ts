import { Module } from '@nestjs/common';
import { DriveService } from './drive.service';
import { DriveController } from './drive.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FederatedKeys } from '../cloud-storage-auth/entities/federated-credentials.entity';
import { RefreshAccessTokenGuard } from './guards/refresh-acess-token.guard';

@Module({
  controllers: [DriveController],
  providers: [DriveService, RefreshAccessTokenGuard],
  imports: [TypeOrmModule.forFeature([FederatedKeys])],
})
export class DriveModule {}
