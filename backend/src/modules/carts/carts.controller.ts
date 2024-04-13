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
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, any>) {
    return this.cartsService.findAll(conditions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete('/owner/:owner')
  removeAllOfOwner(@Param('owner') owner: string) {
    return this.cartsService.removeAllOfOwner(owner);
  }

  @Delete('/market-item')
  removeAllOfMarketItem(@Query('marketItem') marketItem: string) {
    return this.cartsService.removeAllOfMarketItem(
      marketItem.split(',').map(Number),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
