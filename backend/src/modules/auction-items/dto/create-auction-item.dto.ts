import { AuctionItemStatus } from '../enums/auction-item.enum';

export class CreateAuctionItemDto {
  nftId: string;
  nftAddress: string;
  metadata: Record<string, any>;
  owner: string;
  initPrice: string;
  timeStart: string;
  timeEnd: string;
  status?: AuctionItemStatus;
}
