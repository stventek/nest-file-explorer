import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DriveService } from './drive.service';
import { RefreshAccessTokenGuard } from './guards/refresh-acess-token.guard';
import { AccessToken } from './decorators/acess-token.decorator';
import { FolderIdDto } from './dto/query.dto';

@Controller('api/drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @UseGuards(RefreshAccessTokenGuard)
  @Get('list')
  list(@AccessToken() accessToken: string, @Query() folderIdDto: FolderIdDto) {
    return this.driveService.getFolderHierarchy(
      folderIdDto.folderId,
      accessToken,
    );
  }
}
