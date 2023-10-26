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
import { Request, Response } from 'express';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { LocalGuard } from './guards/local.guard';
import { LocalLoginDto } from './dto/local-login.dto';
import { RegisterDto } from './dto/register.dto';
import { IdTokenDto } from './dto/id-token.dto';
import { GoogleAuthV2Service } from './services/google-auth-v2/google-auth-v2.service';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthV2Service,
  ) {}

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

  @Post('api/auth/google')
  async loginv2(@Req() req: Request, @Body() idTokenDto: IdTokenDto) {
    const user = await this.googleAuthService.signIn(idTokenDto.token);
    req.session.passport = { user: { id: user.id } };
    return { message: 'Login Successful' };
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
