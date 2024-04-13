import { Injectable, Logger } from '@nestjs/common';
import { BlockRedisService } from 'src/connections/redis/block.redis.provider';
const sha256 = require('simple-sha256');

@Injectable()
export class Crawl {
  public logger: Logger = new Logger(Crawl.name);

  constructor(private readonly redisService: BlockRedisService) {}

  async getCrawlLatestBlock(): Promise<any> {
    return await this.redisService.get('crawlLatestBlock');
  }

  async setCrawlLatestBlock(blockNumber: number): Promise<boolean> {
    try {
      await this.redisService.set('crawlLatestBlock', blockNumber, -1);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
