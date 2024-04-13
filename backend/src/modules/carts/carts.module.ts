import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketItemsModule } from '../market-items/market-items.module';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), MarketItemsModule],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
