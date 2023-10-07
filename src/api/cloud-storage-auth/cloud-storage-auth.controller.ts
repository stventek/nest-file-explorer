import { Controller, Req, UseGuards, Res, Get } from '@nestjs/common';
import { GoogleDriveService } from './services/google-drive/google-drive.service';
import { randomBytes } from 'crypto';
import { Response } from 'express';
import { LoggedInGuard } from '../auth/guards/logged-in.guard';

@Controller('api/auth-cloud-provider')
export class CloudStorageAuthController {
  constructor(private readonly driveService: GoogleDriveService) {}

  @UseGuards(LoggedInGuard)
  @Get('drive')
  async auth_drive(@Req() req, @Res() res: Response) {
    const state = randomBytes(24).toString('hex');
    req.session.state = state;
    return res.redirect(this.driveService.getLoginURL(state));
  }

  @UseGuards(LoggedInGuard)
  @Get('drive/callback')
  async auth_drive_callback(@Req() req, @Res() res: Response) {
    const { code, state } = req.query;
    if (state !== req.session.state) {
      return res.status(403).send('Invalid state parameter');
    }
    await this.driveService.registerFederatedKeys(code, req.user);
    res.redirect(req.baseUrl + '/drive');
  }
}
