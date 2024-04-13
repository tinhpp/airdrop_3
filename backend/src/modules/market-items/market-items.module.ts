import { Module } from '@nestjs/common';
import { MarketItemsService } from './market-items.service';
import { MarketItemsController } from './market-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketItem } from './entities/market-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketItem])],
  controllers: [MarketItemsController],
  providers: [MarketItemsService],
  exports: [MarketItemsService],
})
export class MarketItemsModule {}
