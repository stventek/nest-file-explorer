import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class DriveService {
  list() {
    return `This action returns all drive`;
  }

  async getFolderContents(folderPath: string, accessToken: string) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth });
      const folderResponse = await drive.files.get({
        fileId: 'root',
      });

      return folderResponse;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting folder contents ${error.message}`,
      );
    }
  }
}
