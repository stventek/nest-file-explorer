import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DriveService } from './drive.service';
import { RefreshAccessTokenGuard } from './guards/refresh-acess-token.guard';
import { AccessToken } from './decorators/acess-token.decorator';
import { FolderIdDto } from './dto/query.dto';
import { LoggedInGuard } from '../auth/guards/logged-in.guard';

@Controller('api/drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @UseGuards(LoggedInGuard, RefreshAccessTokenGuard)
  @Get('hierarchy')
  hierarchy(
    @AccessToken() accessToken: string,
    @Query() folderIdDto: FolderIdDto,
  ) {
    return this.driveService.getFolderHierarchy(
      folderIdDto.folderId,
      accessToken,
    );
  }

  @UseGuards(LoggedInGuard, RefreshAccessTokenGuard)
  @Get('list_children')
  listChildren(
    @AccessToken() accessToken: string,
    @Query() folderIdDto: FolderIdDto,
  ) {
    return this.driveService.getChildren(folderIdDto.folderId, accessToken);
  }
}
