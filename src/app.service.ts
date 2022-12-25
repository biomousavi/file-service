import * as path from 'path';
import { randomBytes } from 'crypto';
import { extension } from 'mime-types';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'minio-nestjs';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

export interface UploadSingleFileResponse {
  url: string;
}

@Injectable()
export class AppService {
  constructor(private client: MinioService, private configService: ConfigService) {}

  async createBucket(bucket: string) {
    await this.client.makeBucket(bucket, 'default');
  }

  async setPublickPolicy(bucket: string) {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetBucketLocation', 's3:ListBucket'],
          Resource: [`arn:aws:s3:::${bucket}`],
        },
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    };
    // apply policy to minio bucket
    await this.client.setBucketPolicy(bucket, JSON.stringify(policy));
  }

  async initBucket(bucket: string) {
    const bucketExists = await this.client.bucketExists(bucket);

    if (!bucketExists) {
      await this.createBucket(bucket);
      await this.setPublickPolicy(bucket);
    }
  }

  getObjectName(mimtype: string) {
    const objectExtension = extension(mimtype);
    const randomString = randomBytes(16).toString('hex');
    return path.join(`${Date.now()}-${randomString}.${objectExtension}`);
  }

  async uploadSingleFile(file: MultipartFile): Promise<UploadSingleFileResponse> {
    try {
      const bucket = (file.fields.bucket as MultipartValue<string>).value;
      await this.initBucket(bucket);

      // get new name for uploading file
      const objectName = this.getObjectName(file.mimetype);
      const metaData = { 'content-type': file.mimetype };

      const port = this.configService.get('MINIO_PORT');
      const endPoint = this.configService.get('SERVER_ENDPOINT');

      await this.client.putObject(bucket, objectName, file.file, metaData);

      // create permanent url
      return { url: `${endPoint}:${port}/${bucket}/${objectName}` };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
