import * as AWS from 'aws-sdk';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_KEY } = process.env;

const s3Config = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
};

const s3 = new AWS.S3(s3Config);

export default s3;
