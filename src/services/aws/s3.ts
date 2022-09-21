import crypto from 'crypto';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { PublicFilesFolder, PublicImagesFolder } from '../../types';
import { AWS, AWS_S3_JUKI_FILES_PUBLIC_BUCKET, AWS_S3_JUKI_IMAGES_PUBLIC_BUCKET } from './config';

export const s3 = new AWS.S3({});

export const uploadPublicFileOrImage = (bucket: string) => async ({
  data,
  type,
  extension: _extension,
  folder,
  nameDataHashed = false,
}: { data: any, type: string, extension?: string, folder: PublicImagesFolder | PublicFilesFolder, nameDataHashed?: boolean }) => {
  console.log({ data, type, _extension, folder, nameDataHashed, bucket, AWS_S3_JUKI_FILES_PUBLIC_BUCKET, AWS_S3_JUKI_IMAGES_PUBLIC_BUCKET });
  const extension = _extension || mime.extension(type);
  const name = nameDataHashed ? crypto.createHash('sha256').update(data, 'utf-8').digest('hex') : uuidv4();
  const key = `${folder}/${name}.${extension}`;
  
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: type,
  };
  return { ...await s3.putObject(params).promise(), bucket, folder, name, extension, key };
};

export const uploadPublicImage = uploadPublicFileOrImage(AWS_S3_JUKI_IMAGES_PUBLIC_BUCKET);

export const uploadPublicFile = uploadPublicFileOrImage(AWS_S3_JUKI_FILES_PUBLIC_BUCKET);

export const getPublicFilesOrImages = (bucket: string) => ({ folder }: { folder: PublicImagesFolder }) => {
  const bucketParams = {
    Bucket: bucket,
    Prefix: `${folder}/`,
    MaxKeys: 10000,
  };
  return s3.listObjects(bucketParams).promise();
};

export const getPublicImages = getPublicFilesOrImages(AWS_S3_JUKI_IMAGES_PUBLIC_BUCKET);

export const getPublicFiles = getPublicFilesOrImages(AWS_S3_JUKI_FILES_PUBLIC_BUCKET);
