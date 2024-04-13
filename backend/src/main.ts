import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as path from 'path';
import * as rfs from 'rotating-file-stream';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  // Write log
  const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs'),
    compress: 'gzip',
  });
  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(morgan('combined'));

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
