import _AWS from 'aws-sdk';

export const AWS_REGION = process.env.AWS_REGION || '';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

export const AWS_S3_JUKI_IMAGES_PUBLIC_BUCKET = process.env.AWS_S3_JUKI_IMAGES_PUBLIC_BUCKET || '';
export const AWS_S3_JUKI_FILES_PUBLIC_BUCKET = process.env.AWS_S3_JUKI_FILES_PUBLIC_BUCKET || '';

export const AWS = _AWS;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});
