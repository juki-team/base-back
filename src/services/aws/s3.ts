import {
  _Object,
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  ListObjectsCommandInput,
  ListObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { LogLevel } from '@juki-team/commons';
import crypto from 'crypto';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { log } from '../../helpers';
import { FilesJukiPrivate, FilesJukiPub, ImagesJukiPub, LinkFilesJukiLy } from '../../types';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, WITHOUT_AWS_KEYS } from './config';

export const awsS3 = new S3Client({
  credentials: WITHOUT_AWS_KEYS
    ? undefined
    : { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
});

export function s3Bucket(bucket: string) {
  
  return {
    getBucketName() {
      return bucket;
    },
    async putObject({
                      body,
                      contentType,
                      extension: _extension,
                      folder,
                      nameDataHashed = false,
                      name: _name,
                      params: otherParams,
                    }: {
      body: any,
      contentType: string,
      extension?: string,
      folder: ImagesJukiPub | FilesJukiPub | FilesJukiPrivate | LinkFilesJukiLy,
      nameDataHashed?: boolean,
      name?: string,
      params?: Partial<PutObjectCommandInput>,
    }): Promise<PutObjectCommandOutput & {
      bucket: string, folder: string, name: string, extension: string, key: string
    }> {
      const extension = _extension ?? (mime.extension(contentType) || '.bin');
      const name = nameDataHashed ? crypto.createHash('sha256')
        .update(body, 'utf-8')
        .digest('hex') : (_name ? _name : uuidv4());
      const key = `${folder ? folder + '/' : ''}${name}${extension ? '.' + extension : ''}`;
      
      const params = {
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ...otherParams,
      };
      const command = new PutObjectCommand(params);
      return { ...await awsS3.send(command), bucket, folder, name, extension, key };
    },
    async getObject({ key }: { key: string }): Promise<string> {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const data = await awsS3.send(command);
      if (data?.Body) {
        return data.Body?.transformToString();
      }
      return '';
    },
    async getHeadObject({ key }: { key: string }): Promise<Record<string, string>> {
      const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
      const data = await awsS3.send(command);
      console.log(data);
      if (data?.Metadata) {
        return data.Metadata;
      }
      return {};
    },
    async copyObject({ copySource, key }: { copySource: string, key: string }): Promise<PutObjectCommandOutput & {
      bucket: string,
    }> {
      const command = new CopyObjectCommand({ CopySource: `/${bucket}/${copySource}`, Bucket: bucket, Key: key });
      const data = await awsS3.send(command);
      return { ...data, bucket };
    },
    deleteObject({ key }: { key: string }): Promise<DeleteObjectCommandOutput> {
      const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
      return awsS3.send(command);
    },
    listObjects({ prefix }: { prefix: string }): Promise<ListObjectsCommandOutput> {
      const bucketParams = {
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: 10000,
      };
      const command = new ListObjectsCommand(bucketParams);
      return awsS3.send(command);
    },
    async listAllObjects({ prefix }: { prefix: string }): Promise<_Object[]> {
      let isTruncated = true;
      let marker;
      const elements: _Object[] = [];
      while (isTruncated) {
        const params: ListObjectsCommandInput = { Bucket: bucket };
        if (prefix) params.Prefix = prefix;
        if (marker) params.Marker = marker;
        try {
          const command = new ListObjectsCommand(params);
          const response = await awsS3.send(command);
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
    async existsKey(key: string) {
      try {
        await this.getObject({ key });
        return true;
      } catch (error) {
        log(LogLevel.WARN)(`s3 object with key: "${key}" not found`, { error });
        return false;
      }
    },
  };
}
