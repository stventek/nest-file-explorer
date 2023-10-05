import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { LoggedInGuard } from './guards/logged-in.guard';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOauthGuard)
  @Get('api/google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @UseGuards(GoogleOauthGuard)
  @Get('api/google/callback')
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    if (!req.user) {
      throw new BadRequestException('Unauthenticated');
    }
    return res.json({});
  }

  @UseGuards(LoggedInGuard)
  @Get('api/protected')
  async protectedd(@Req() req, @Res() res: Response) {
    return res.json({});
  }
}
