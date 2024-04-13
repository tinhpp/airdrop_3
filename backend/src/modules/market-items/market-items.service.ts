import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import { In, Repository } from 'typeorm';
import { getNftMetadata } from '../utils/moralis.util';
import * as MarketplaceABI from './abi/Marketplace.json';
import { CreateMarketItemDto } from './dto/create-market-item.dto';
import { UpdateMarketItemDto } from './dto/update-market-item.dto';
import { MarketItem } from './entities/market-item.entity';
import { MarketItemStatus } from './enums/market-item.enum';

@Injectable()
export class MarketItemsService {
  private logger = new Logger(MarketItemsService.name);

  constructor(
    @InjectRepository(MarketItem)
    private readonly marketItemsRepository: Repository<MarketItem>,
    private readonly configService: ConfigService,
  ) {}

  async create(createMarketItemDto: CreateMarketItemDto) {
    return this.marketItemsRepository.save(createMarketItemDto);
  }

  async findAll(conditions: Record<string, any> = {}) {
    const { page = 1, size = 10, ...restConditions } = conditions;
    if (restConditions.status)
      restConditions.status = In(restConditions.status.split(','));
    const [nfts, total] = await this.marketItemsRepository.findAndCount({
      where: restConditions,
      skip: (page - 1) * size,
      take: size,
      order: { id: 'DESC' },
    });
    return { nfts, total };
  }

  async findOne(id: number, conditions: Record<string, any> = {}) {
    const marketItem = await this.marketItemsRepository.findOne({
      where: { id, ...conditions },
    });
    if (!marketItem) {
      throw new HttpException(
        'Market item is not existed',
        HttpStatus.NOT_FOUND,
      );
    }
    return marketItem;
  }

  update(id: number, updateMarketItemDto: UpdateMarketItemDto) {
    return this.marketItemsRepository.update(id, updateMarketItemDto);
  }

  remove(id: number) {
    return `This action removes a #${id} marketItem`;
  }

  async handleEvents(rpcProvider: JsonRpcProvider, from: number, to: number) {
    try {
      const marketplaceContract = new Contract(
        this.configService.get<string>('MARKETPLACE_ADDRESS'),
        MarketplaceABI,
        rpcProvider,
      );

      // Fetch events data
      const events = await marketplaceContract.queryFilter('*', from, to);

      console.log(from, to, this.configService.get<string>('MARKETPLACE_ADDRESS'));

      for (let i = 0; i < events.length; i++) {
        const event: any = events[i];
        if (!event) continue;
        if (Object.keys(event).length === 0) continue;
        if (!event.fragment) continue;

        switch (event.fragment.name) {
          case 'ListedItem': {
            const {
              itemId,
              marketItem: {
                nft,
                tokenId,
                price,
                timeSaleStart,
                timeSaleEnd,
                salePrice,
              },
            } = event.args;
            const currentMarketItem = await this.marketItemsRepository.findOne({
              where: {
                nftAddress: nft,
                nftId: tokenId.toString(),
                status: MarketItemStatus.PENDING,
                timeSaleStart: timeSaleStart.toString(),
                timeSaleEnd: timeSaleEnd.toString(),
                salePrice:
                  salePrice === BigInt(0)
                    ? '0'
                    : ethers.formatUnits(salePrice, 18),
              },
            });

            if (currentMarketItem) {
              await this.marketItemsRepository.update(currentMarketItem.id, {
                onChainId: itemId.toString(),
                status: MarketItemStatus.OPENING,
              });
            } else {
              const chainId =
                '0x' +
                Number(this.configService.get<string>('CHAIN_ID')).toString(16);
              const metadata = await getNftMetadata(
                chainId,
                nft,
                tokenId.toString(),
              );

              await this.marketItemsRepository.save({
                nftId: tokenId.toString(),
                nftAddress: nft,
                price: ethers.formatUnits(price, 18),
                timeSaleStart: timeSaleStart.toString(),
                timeSaleEnd: timeSaleEnd.toString(),
                owner: (
                  await marketplaceContract.marketItems(itemId.toString())
                ).seller,
                onChainId: itemId.toString(),
                salePrice:
                  salePrice === BigInt(0)
                    ? '0'
                    : ethers.formatUnits(salePrice, 18),
                metadata,
                status: MarketItemStatus.OPENING,
              });
            }
            break;
          }

          case 'PurchasedItem': {
            const { itemId, buyer } = event.args;
            await this.marketItemsRepository.update(
              { onChainId: itemId.toString() },
              {
                tx: event.transactionHash,
                status: MarketItemStatus.SOLD,
                buyer,
              },
            );
            break;
          }
          case 'ClosedItem': {
            const { itemId } = event.args;
            await this.marketItemsRepository.update(
              { onChainId: itemId.toString() },
              {
                tx: event.transactionHash,
                status: MarketItemStatus.CLOSED,
              },
            );
            break;
          }
          case 'ForceRemovedItem': {
            const { itemId } = event.args;
            await this.marketItemsRepository.update(
              { onChainId: itemId.toString() },
              {
                status: MarketItemStatus.CLOSED,
              },
            );
            break;
          }

          case 'UpdatedItem': {
            const { itemId, price, timeSaleStart, timeSaleEnd, salePrice } =
              event.args;
            await this.marketItemsRepository.update(
              { onChainId: itemId.toString() },
              {
                price: ethers.formatUnits(price, 18),
                timeSaleStart: timeSaleStart.toString(),
                timeSaleEnd: timeSaleEnd.toString(),
                salePrice:
                  salePrice === BigInt(0)
                    ? '0'
                    : ethers.formatUnits(salePrice, 18),
              },
            );
            break;
          }

          default:
            break;
        }
      }
    } catch (error) {
      this.logger.error(error);
      if (error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(error.body, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
