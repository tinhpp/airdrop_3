import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MarketItemsService } from '../market-items/market-items.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    private readonly marketItemsService: MarketItemsService,
  ) {}
  async create(createCartDto: CreateCartDto) {
    const isExisted = await this.cartsRepository.findOne({
      where: {
        owner: createCartDto.owner,
        marketItem: {
          id: createCartDto.marketItem,
        },
      },
    });
    if (isExisted) {
      throw new BadRequestException('Item already in cart');
    }
    const currentMarketItem = await this.marketItemsService.findOne(
      createCartDto.marketItem,
    );

    const { marketItem, ...data } = createCartDto;

    createCartDto.marketItem = marketItem;
    const newCart = await this.cartsRepository.save({
      ...data,
      marketItem: currentMarketItem,
    });
    return this.findOne(newCart.id);
  }

  findAll(conditions: Record<string, any>) {
    return this.cartsRepository.find({
      where: conditions,
      relations: ['marketItem'],
    });
  }

  findOne(id: number) {
    return this.cartsRepository.findOne({
      where: {
        id,
      },
      relations: ['marketItem'],
    });
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return this.cartsRepository.update(id, updateCartDto);
  }

  remove(id: number) {
    return this.cartsRepository.delete(id);
  }

  removeAllOfOwner(owner: string) {
    return this.cartsRepository.delete({ owner });
  }

  removeAllOfMarketItem(marketItem: number[]) {
    return this.cartsRepository.delete({
      marketItem: {
        id: In(marketItem),
      },
    });
  }
}
