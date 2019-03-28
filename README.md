# Deploy tools

Some utils to finish your deployment.

# Upload your file to AWS S3
```ts
const path = require('path');
const { S3Uploader } = require('@abramstyle/deploy-tools');

const buildPath = path.resolve(__dirname, '../dist');

const uploadConfig = {
  bucket: 'YOUR_BUCKET_NAME',
  keyPrefix: 'YOUR_DIRECTORY_PREFIX',
};

async function startJob() {
  const uploader = new S3Uploader(uploadConfig);

  uploader.on('success', ({ count, finished, filename }) => {
    console.log(`progress: ${finished}/${count}. file ${filename} upload success.`);
  });
  uploader.on('done', () => {
    console.log('uploading finished.');
  });

  await uploader.uploadDir(buildPath);
}

console.log('initializing...');

startJob().then(() => {
  console.log('start upload...');
}).catch((error) => {
  console.error('file upload failed.', error);
});
```

## API
### constructor
```ts
interface UploaderConfig {
  bucket: string,
  keyPrefix: string,
}
```
```ts
public constructor(config: UploaderConfig)
```

### uploadFile
```ts
public async uploadFile(filepath: string): Promise<any>
```

### uploadDir
```ts
public async uploadDir(distDir: string): Promise<void>
```
