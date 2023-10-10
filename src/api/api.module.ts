import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CloudStorageAuthModule } from './cloud-storage-auth/cloud-storage-auth.module';
import { DriveModule } from './drive/drive.module';

@Module({
  imports: [UserModule, AuthModule, CloudStorageAuthModule, DriveModule],
  providers: [],
})
export class ApiModule {}
