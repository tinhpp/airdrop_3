import { Module } from '@nestjs/common';
import { AuctionItemsService } from './auction-items.service';
import { AuctionItemsController } from './auction-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionItem } from './entities/auction-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionItem])],
  controllers: [AuctionItemsController],
  providers: [AuctionItemsService],
  exports: [AuctionItemsService],
})
export class AuctionItemsModule {}
