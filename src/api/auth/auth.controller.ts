import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LocalGuard } from './guards/local.guard';
import { LocalLoginDto } from './dto/local-login.dto';
import { RegisterDto } from './dto/register.dto';
import { IdTokenDto } from './dto/id-token.dto';
import { GoogleAuthV2Service } from './services/google-auth-v2/google-auth-v2.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthV2Service,
  ) {}

  // old login without frontend SDK, plain passport implementation,

  /*   @UseGuards(GoogleOauthGuard)
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
  } */

  @Post('google')
  async loginv2(@Req() req: Request, @Body() idTokenDto: IdTokenDto) {
    const user = await this.googleAuthService.signIn(idTokenDto.token);
    req.session.passport = { user: { id: user.id } };
    return { message: 'Login Successful' };
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Req() req: Request,
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() user: LocalLoginDto,
  ) {
    return res.json({ user: req.user });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() userDto: RegisterDto) {
    const user = await this.authService.register(userDto);
    return { user };
  }
}
