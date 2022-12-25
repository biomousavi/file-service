import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class MultipartGuard implements CanActivate {
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    if (!req.isMultipart()) {
      throw new BadRequestException('multipart/form-data expected.');
    }

    return true;
  }
}
