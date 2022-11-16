import { ErrorCode, JkError } from '@juki-team/commons';
import { DeleteObjectOutput } from 'aws-sdk/clients/s3';
import crypto from 'crypto';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { FilesJukiPrivate, FilesJukiPub, ImagesJukiPub } from '../../types';
import { AWS } from './config';

export const s3 = new AWS.S3({});

export const s3Bucket = (bucket: string) => ({
  s3PutObject: async ({
    body,
    contentType,
    extension: _extension,
    folder,
    nameDataHashed = false,
    name: _name,
  }: { body: any, contentType: string, extension?: string, folder: ImagesJukiPub | FilesJukiPub | FilesJukiPrivate, nameDataHashed?: boolean, name?: string }) => {
    const extension = _extension || mime.extension(contentType);
    const name = nameDataHashed ? crypto.createHash('sha256').update(body, 'utf-8').digest('hex') : (_name ? _name : uuidv4());
    const key = `${folder}/${name}.${extension}`;
    
    const params = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    };
    return { ...await s3.putObject(params).promise(), bucket, folder, name, extension, key };
  },
  s3GetObject: ({ key }: { key: string }) => {
    return new Promise<string>((resolve, reject) => {
      s3.getObject({ Bucket: bucket, Key: key }, async function (err, data) {
        if (err) {
          reject(err);
        } else {
          if (data.Body) {
            resolve(data.Body?.toString());
          } else {
            reject(new JkError(ErrorCode.ERR500, { message: 'body is not valid' + data.toString() }));
          }
        }
      });
    });
  },
  s3DeleteObject: ({ key }: { key: string }) => {
    return new Promise<DeleteObjectOutput>((resolve, reject) => {
      s3.deleteObject({ Bucket: bucket, Key: key }, async function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  s3ListObjects: ({ prefix }: { prefix: string }) => {
    const bucketParams = {
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: 10000,
    };
    return s3.listObjects(bucketParams).promise();
  },
  s3ListAllObjects: async ({ prefix }: { prefix: string }) => {
    let isTruncated = true;
    let marker;
    const elements: AWS.S3.Object[] = [];
    while (isTruncated) {
      let params: AWS.S3.Types.ListObjectsRequest = { Bucket: bucket };
      if (prefix) params.Prefix = prefix;
      if (marker) params.Marker = marker;
      try {
        const response = await s3.listObjects(params).promise();
        response.Contents?.forEach(item => elements.push(item));
        isTruncated = !!response.IsTruncated;
        if (isTruncated) {
          marker = response.Contents?.slice(-1)[0].Key;
        }
      } catch (error) {
        throw error;
      }
    }
    return elements;
  },
});
