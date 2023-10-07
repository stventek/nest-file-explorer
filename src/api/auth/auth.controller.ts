import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LocalGuard } from './guards/local.guard';
import { LocalLoginDto } from './dto/local-login.dto';
import { RegisterDto } from './dto/register.dto';

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
    return res.json(req.user);
  }

  @UseGuards(LoggedInGuard)
  @Get('api/auth/protected')
  async protectedd(@Req() req, @Res() res: Response) {
    return res.json({ a: 1 });
  }

  @Post('api/auth/login')
  @UseGuards(LocalGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req, @Res() res: Response, @Body() user: LocalLoginDto) {
    return res.json({ message: 'Login successful' });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('api/auth/register')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async register(@Req() req, @Body() user: RegisterDto) {
    return this.authService.register(user);
  }
}
