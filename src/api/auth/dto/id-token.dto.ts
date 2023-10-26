import { IsString } from 'class-validator';

export class IdTokenDto {
  @IsString()
  token: string;
}
