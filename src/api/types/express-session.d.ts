import 'express-session';
declare module 'express-session' {
  interface SessionData {
    passport: {
      user: { [key: string]: any };
    };
  }
}
