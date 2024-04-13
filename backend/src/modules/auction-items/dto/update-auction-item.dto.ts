import { PartialType } from '@nestjs/mapped-types';
import { CreateAuctionItemDto } from './create-auction-item.dto';
import { AuctionItemStatus } from '../enums/auction-item.enum';

export class UpdateAuctionItemDto extends PartialType(CreateAuctionItemDto) {
  status?: AuctionItemStatus;
  onChainId?: string;
  highestBidder?: Record<string, any>;
}
