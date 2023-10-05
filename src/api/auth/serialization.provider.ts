import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(user: any, done: (err: Error, user: { id: number }) => void) {
    done(null, { id: user.id });
  }

  deserializeUser(
    payload: { id: number; role: string },
    done: (err: Error, user: any) => void,
  ) {
    done(null, payload.id);
  }
}
