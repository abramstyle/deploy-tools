export interface UploaderConfig {
  bucket: string,
  keyPrefix: string,
}

export interface Uploader {
  uploadDir(distDir: string): Promise<void>;
  uploadFile(filepath: string): Promise<any>;
}
