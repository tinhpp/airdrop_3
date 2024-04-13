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
import { AuctionItemsService } from './auction-items.service';
import { CreateAuctionItemDto } from './dto/create-auction-item.dto';
import { UpdateAuctionItemDto } from './dto/update-auction-item.dto';

@Controller('auction-items')
export class AuctionItemsController {
  constructor(private readonly auctionItemsService: AuctionItemsService) {}

  @Post()
  create(@Body() createAuctionItemDto: CreateAuctionItemDto) {
    return this.auctionItemsService.create(createAuctionItemDto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, any>) {
    return this.auctionItemsService.findAll(conditions);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() conditions: Record<string, any>) {
    return this.auctionItemsService.findOne(+id, conditions);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuctionItemDto: UpdateAuctionItemDto,
  ) {
    return this.auctionItemsService.update(+id, updateAuctionItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionItemsService.remove(+id);
  }
}
