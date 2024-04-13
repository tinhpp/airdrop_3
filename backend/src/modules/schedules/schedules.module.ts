import { Module } from '@nestjs/common';
import { ConnectionsModule } from '@src/connections/connections.module';
import { MarketItemsModule } from '../market-items/market-items.module';
import { CrawlsSchedule } from './crawls.schedule';
import { RepositoryModule } from './repositories/repository.module';
import { AuctionItemsModule } from '../auction-items/auction-items.module';

@Module({
  imports: [
    ConnectionsModule,
    RepositoryModule,
    MarketItemsModule,
    AuctionItemsModule
  ],
  controllers: [],
  providers: [CrawlsSchedule],
})
export class SchedulesModule {}
