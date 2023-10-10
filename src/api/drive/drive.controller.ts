import { Controller, Get, UseGuards } from '@nestjs/common';
import { DriveService } from './drive.service';
import { RefreshAccessTokenGuard } from './guards/refresh-acess-token.guard';
import { AccessToken } from './decorators/acess-token.decorator';

@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @UseGuards(RefreshAccessTokenGuard)
  @Get('list')
  list(@AccessToken() accessToken: string) {
    return this.driveService.getFolderContents('test', accessToken);
  }
}
