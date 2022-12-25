import { FastifyRequest } from 'fastify';
import { MultipartGuard } from './multipart.guard';
import { AppService, UploadSingleFileResponse } from './app.service';
import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

@Controller('/uploads')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/single')
  @HttpCode(HttpStatus.OK)
  @UseGuards(MultipartGuard)
  async uploadFile(@Req() req: FastifyRequest): Promise<UploadSingleFileResponse> {
    // set upload file limitation
    const file = await req.file({ limits: { fields: 1, files: 1 } });

    return await this.appService.uploadSingleFile(file);
  }
}
