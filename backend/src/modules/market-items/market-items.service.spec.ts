import { Test, TestingModule } from '@nestjs/testing';
import { MarketItemsService } from './market-items.service';

describe('MarketItemsService', () => {
  let service: MarketItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketItemsService],
    }).compile();

    service = module.get<MarketItemsService>(MarketItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
