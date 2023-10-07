import { Trim } from 'class-sanitizer';
import { IsEmail, IsString } from 'class-validator';

export class LocalLoginDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
