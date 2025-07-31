export interface FileMetadata {
  _id: string;
  filename: string;
  path: string;
  status: 'pending' | 'scanning' | 'clean' | 'infected';
  uploadedAt: string;
  scannedAt: string | null;
  result: 'clean' | 'infected' | null;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
}

export interface FilesResponse {
  files: FileMetadata[];
} 