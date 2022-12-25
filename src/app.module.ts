import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinioModule } from 'minio-nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: [`.env`] }),
    MinioModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          port: +configService.get('MINIO_PORT'),
          endPoint: configService.get('MINIO_ENDPOINT'),
          accessKey: configService.get('MINIO_ROOT_USER'),
          secretKey: configService.get('MINIO_ROOT_PASSWORD'),
          useSSL: configService.get('NODE_ENV') === 'production' ? true : false,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
