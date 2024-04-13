import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JsonRpcProvider } from 'ethers';
import { MarketItemsService } from '../market-items/market-items.service';
import { Crawl } from './repositories/crawl.repository';
import { AuctionItemsService } from '../auction-items/auction-items.service';

@Injectable()
export class CrawlsSchedule implements OnModuleInit {
  private rpcProvider: JsonRpcProvider;
  private readonly logger: Logger = new Logger(CrawlsSchedule.name);

  constructor(
    private marketItemsService: MarketItemsService,
    private auctionItemsService: AuctionItemsService,
    private readonly crawl: Crawl,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(
      this.configService.get<string>('NETWORK_RPC_URL'),
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleEvents() {
    const onChainLatestBlock = (await this.rpcProvider.getBlockNumber()) - 5;
    if (!onChainLatestBlock) {
      return;
    }

    let crawlLatestBlock = await this.crawl.getCrawlLatestBlock();
    if (!crawlLatestBlock || crawlLatestBlock === 0) {
      crawlLatestBlock = onChainLatestBlock - 1;
      await this.crawl.setCrawlLatestBlock(crawlLatestBlock);
    }

    let toBlock;
    if (onChainLatestBlock - 1 <= crawlLatestBlock) {
      toBlock = crawlLatestBlock;
    } else {
      toBlock = onChainLatestBlock - 1;
    }

    // Avoid error exceed maximum block range
    if (toBlock - crawlLatestBlock > 1000) {
      toBlock = crawlLatestBlock + 1000;
    }

    this.logger.log(
      `Crawl events from block ${crawlLatestBlock + 1} to block ${toBlock}`,
    );

    await this.marketItemsService.handleEvents(
      this.rpcProvider,
      44332504,
      44332506,
    );

    await this.auctionItemsService.handleEvents(
      this.rpcProvider,
      crawlLatestBlock,
      toBlock,
    );

    await this.crawl.setCrawlLatestBlock(toBlock);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async depositToLendingPoolTreasury() {}
}
