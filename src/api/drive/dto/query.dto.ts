import { IsNotEmpty, IsString } from 'class-validator';

export class FolderIdDto {
  @IsString()
  @IsNotEmpty()
  public folderId: string;
}
