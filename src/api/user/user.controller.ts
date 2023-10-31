import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { LoggedInGuard } from '../auth/guards/logged-in.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('self')
  @UseGuards(LoggedInGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Req() req: Request) {
    return { user: req.user };
  }
}
