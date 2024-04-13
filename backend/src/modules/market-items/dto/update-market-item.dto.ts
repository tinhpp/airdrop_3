import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketItemDto } from './create-market-item.dto';
import { MarketItemStatus } from '../enums/market-item.enum';

export class UpdateMarketItemDto extends PartialType(CreateMarketItemDto) {
  status?: MarketItemStatus;
  tx?: string;
  onChainId?: string;
}
