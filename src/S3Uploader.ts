import * as EventEmitter from 'events';
import { Uploader, UploaderConfig } from '../interface';
import './config';
import { readDir, readFile, generateKey } from './helpers';
import s3 from './s3';
import { resolve, basename } from 'path';
import * as mime from 'mime-types';

class S3Uploader extends EventEmitter implements Uploader {
  private readonly bucket: string;
  private readonly keyPrefix: string;
  private fileCount: number = 0;
  private finishedCount: number = 0;

  public constructor(config: UploaderConfig) {
    super();

    const { bucket, keyPrefix } = config;

    this.bucket = bucket;
    this.keyPrefix = keyPrefix;
  }

  private checkIsAllDone(): void {
    const isDone = this.fileCount === this.finishedCount;

    if (isDone) {
      this.emit('done');
    }
  }

  private success(): void {
    this.finishedCount++;
  }

  public async uploadDir(distDir: string): Promise<void> {
    const files = await readDir(distDir);
    this.fileCount = files.length;

    for (const filename of files) {
      const filepath = resolve(distDir, filename);

      this.uploadFile(filepath).then(() => {
        this.success();

        const data = {
          count: this.fileCount,
          finished: this.finishedCount,
          filename
        };

        this.emit('success', data);
        this.checkIsAllDone();
      }).catch(error => {
        this.emit('error', error);
      });
    }

    return;
  }

  public async uploadFile(filepath: string): Promise<any> {
    const file = await readFile(filepath);
    const filename = basename(filepath);
    const { bucket: Bucket, keyPrefix: KeyPrefix } = this;
    const ACL = 'public-read';
    const ContentType = mime.lookup(filename) || undefined;
    const params = {
      Bucket,
      Body: file,
      ACL,
      ContentType,
      CacheControl: 'max-age=31536000',
      Key: generateKey(KeyPrefix, filename)
    };

    return s3.upload(params).promise();
  }
}

export default S3Uploader;
