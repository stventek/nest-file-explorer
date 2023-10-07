import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../user/entities/user.entity';
import { AuthGoogleService } from '../services/auth-google/auth-google.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthGoogleService) {
    super();
  }
  serializeUser(user: User, done: (err: Error, user: { id: number }) => void) {
    done(null, { id: user.id });
  }

  deserializeUser(
    payload: { id: number },
    done: (err: Error, user: any) => void,
  ) {
    this.authService.findById(payload.id).then((user) => done(null, user));
  }
}
