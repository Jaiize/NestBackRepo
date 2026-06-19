import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: '____',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

export { s3Client };
