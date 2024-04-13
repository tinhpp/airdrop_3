import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MarketItemsService } from './market-items.service';
import { CreateMarketItemDto } from './dto/create-market-item.dto';
import { UpdateMarketItemDto } from './dto/update-market-item.dto';

@Controller('market-items')
export class MarketItemsController {
  constructor(private readonly marketItemsService: MarketItemsService) {}

  @Post()
  create(@Body() createMarketItemDto: CreateMarketItemDto) {
    return this.marketItemsService.create(createMarketItemDto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, any>) {
    return this.marketItemsService.findAll(conditions);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() conditions: Record<string, any>) {
    return this.marketItemsService.findOne(+id, conditions);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketItemDto: UpdateMarketItemDto,
  ) {
    return this.marketItemsService.update(+id, updateMarketItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketItemsService.remove(+id);
  }
}
