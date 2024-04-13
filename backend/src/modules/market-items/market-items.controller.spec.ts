import { Test, TestingModule } from '@nestjs/testing';
import { MarketItemsController } from './market-items.controller';
import { MarketItemsService } from './market-items.service';

describe('MarketItemsController', () => {
  let controller: MarketItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketItemsController],
      providers: [MarketItemsService],
    }).compile();

    controller = module.get<MarketItemsController>(MarketItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
