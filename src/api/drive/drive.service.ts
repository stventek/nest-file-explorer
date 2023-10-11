import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class DriveService {
  async getChildren(folderId: string, accessToken: string) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth });
      const children = [];
      const response = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, parents, createdTime, modifiedTime, size)',
      });

      response.data.files.forEach((child) => {
        children.push({
          id: child.id,
          createdAt: child.createdTime,
          modified: child.modifiedTime,
          name: child.name,
          size: child.size,
          parentId: folderId,
          type:
            child.mimeType === 'application/vnd.google-apps.folder'
              ? 'folder'
              : 'file',
        });
      });
      return children;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting folder contents ${error.message}`,
      );
    }
  }
  /* loads Hierarchy excluding non inmediate childrens of the current folder for performance improvement*/
  async getFolderHierarchy(folderId: string, accessToken: string) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth });

      const adjacencyList = {};

      let currentFolderId = folderId;

      while (currentFolderId) {
        // Fetch folder metadata
        const folderResponse = await drive.files.get({
          fileId: currentFolderId,
          fields:
            'id, name, parents, createdTime, modifiedTime, size, mimeType',
        });
        // Build the adjacency list entry for the current folder
        adjacencyList[currentFolderId] = {
          id: folderResponse.data.id,
          createdAt: folderResponse.data.createdTime,
          modified: folderResponse.data.modifiedTime,
          name: folderResponse.data.name,
          size: folderResponse.data.size || '0',
          parentId: folderResponse.data.parents?.[0] || '',
          type:
            folderResponse.data.mimeType ===
            'application/vnd.google-apps.folder'
              ? 'folder'
              : 'file',
        };

        // Fetch immediate children of the given folder
        if (currentFolderId === folderId) {
          const childrenResponse = await drive.files.list({
            q: `'${currentFolderId}' in parents`,
            fields: 'files(id, name, parents, createdTime, modifiedTime, size)',
          });
          // add immediate children ids to the given folder children array
          adjacencyList[currentFolderId]['childrenIds'] =
            childrenResponse.data.files.map((child) => child.id);
          // add immediate children of the given folder to the adj list
          childrenResponse.data.files.forEach((child) => {
            adjacencyList[child.id] = {
              id: child.id,
              createdAt: child.createdTime,
              modified: child.modifiedTime,
              name: child.name,
              size: child.size,
              parentId: folderId,
              type:
                child.mimeType === 'application/vnd.google-apps.folder'
                  ? 'folder'
                  : 'file',
            };
          });
        } else {
          adjacencyList[currentFolderId]['childrenIds'] = [];
        }
        currentFolderId = folderResponse.data.parents?.[0];
      }
      return adjacencyList;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting folder contents ${error.message}`,
      );
    }
  }
}
