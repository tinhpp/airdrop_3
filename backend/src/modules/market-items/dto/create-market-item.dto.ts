import { MarketItemStatus } from '../enums/market-item.enum';

export class CreateMarketItemDto {
  nftId: string;
  nftAddress: string;
  metadata: Record<string, any>;
  owner: string;
  price: string;
  timeSaleStart: string;
  timeSaleEnd: string;
  salePrice: string;
  status?: MarketItemStatus;
}
