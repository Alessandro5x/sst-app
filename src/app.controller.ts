import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Resource } from 'sst';
import { Express } from 'express';
import { Upload } from '@aws-sdk/lib-storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Post, Redirect, UploadedFile, UseInterceptors } from '@nestjs/common';

const s3 = new S3Client({});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: "MyBucket",
      ContentType: file.mimetype,
      Key: file.originalname,
      Body: file.buffer,
    };

    const upload = new Upload({
      params,
      client: s3,
    });

    await upload.done();

    return 'File uploaded successfully.';
  }

  @Get('latest')
  @Redirect('/', 302)
  async getLatestFile() {
  const objects = await s3.send(
    new ListObjectsV2Command({
      Bucket: "MyBucket",
    }),
  );

  if (!objects.Contents || objects.Contents.length === 0) {
    throw new Error("No files found in the bucket.");
  }
  
  const latestFile = objects.Contents
  .filter(obj => obj.LastModified) // Remove undefined LastModified
  .sort((a, b) => 
    (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
  )[0];

  if (!latestFile) {
    throw new Error("No valid files found in the bucket.");
  }

  const command = new GetObjectCommand({
    Key: latestFile.Key!,
    Bucket: "MyBucket",
  });

  const url = await getSignedUrl(s3, command);

  return { url };
  }
}
