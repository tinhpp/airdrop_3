import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.provider';

@Injectable()
export class BlockRedisService extends RedisService {
  constructor() {
    const configService = new ConfigService();
    super({
      host: configService.get<string>('REDIS_BLOCK_HOST'),
      port: configService.get<string>('REDIS_BLOCK_PORT'),
      password: configService.get<string>('REDIS_BLOCK_PASS'),
      family: Number(configService.get<string>('REDIS_BLOCK_FAMILY')),
      db: configService.get<string>('REDIS_BLOCK_DB'),
    });
  }
}
