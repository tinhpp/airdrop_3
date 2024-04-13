import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import { In, Repository } from 'typeorm';
import { getNftMetadata } from '../utils/moralis.util';
import * as MarketplaceABI from './abi/Marketplace.json';
import { CreateAuctionItemDto } from './dto/create-auction-item.dto';
import { UpdateAuctionItemDto } from './dto/update-auction-item.dto';
import { AuctionItem } from './entities/auction-item.entity';
import { AuctionItemStatus } from './enums/auction-item.enum';

@Injectable()
export class AuctionItemsService {
  private logger = new Logger(AuctionItemsService.name);

  constructor(
    @InjectRepository(AuctionItem)
    private readonly auctionItemsRepository: Repository<AuctionItem>,
    private readonly configService: ConfigService,
  ) {}

  async create(createAuctionItemDto: CreateAuctionItemDto) {
    console.log('createAuctionItemDto', createAuctionItemDto);
    return this.auctionItemsRepository.save(createAuctionItemDto);
  }

  async findAll(conditions: Record<string, any> = {}) {
    const { page = 1, size = 10, ...restConditions } = conditions;
    if (restConditions.status)
      restConditions.status = In(restConditions.status.split(','));
    const [nfts, total] = await this.auctionItemsRepository.findAndCount({
      where: restConditions,
      skip: (page - 1) * size,
      take: size,
      order: { id: 'DESC' },
    });
    return { nfts, total };
  }

  async findOne(id: number, conditions: Record<string, any> = {}) {
    const auctionItem = await this.auctionItemsRepository.findOne({
      where: { id, ...conditions },
    });
    if (!auctionItem) {
      throw new HttpException(
        'Market item is not existed',
        HttpStatus.NOT_FOUND,
      );
    }
    return auctionItem;
  }

  update(id: number, updateAuctionItemDto: UpdateAuctionItemDto) {
    return this.auctionItemsRepository.update(id, updateAuctionItemDto);
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

      for (let i = 0; i < events.length; i++) {
        const event: any = events[i];
        if (!event) continue;
        if (Object.keys(event).length === 0) continue;
        if (!event.fragment) continue;

        switch (event.fragment.name) {
          case 'ListedAuctionItem': {
            const {
              itemId,
              auctionItem: { nft, tokenId, initPrice, timeStart, timeEnd },
            } = event.args;

            const currentAuctionItem =
              await this.auctionItemsRepository.findOne({
                where: {
                  nftAddress: nft,
                  nftId: tokenId.toString(),
                  status: AuctionItemStatus.PENDING,
                  timeStart: timeStart.toString(),
                  timeEnd: timeEnd.toString(),
                  initPrice: ethers.formatUnits(initPrice, 18),
                },
              });

            if (currentAuctionItem) {
              await this.auctionItemsRepository.update(currentAuctionItem.id, {
                onChainId: itemId.toString(),
                status: AuctionItemStatus.OPENING,
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

              await this.auctionItemsRepository.save({
                nftId: tokenId.toString(),
                nftAddress: nft,
                initPrice: ethers.formatUnits(initPrice, 18),
                timeStart: timeStart.toString(),
                timeEnd: timeEnd.toString(),
                owner: (
                  await marketplaceContract.marketItems(itemId.toString())
                ).seller,
                onChainId: itemId.toString(),
                metadata,
                status: AuctionItemStatus.OPENING,
              });
            }
            break;
          }

          case 'BiddedItem': {
            const { itemId, bidder, amount } = event.args;
            await this.auctionItemsRepository.update(
              { onChainId: itemId.toString() },
              {
                highestBidder: {
                  bidder: bidder,
                  amount: ethers.formatUnits(amount, 18),
                } as Record<string, any>,
              },
            );
            break;
          }
          case 'ClosedAuctionItem': {
            const { itemId } = event.args;
            await this.auctionItemsRepository.update(
              { onChainId: itemId.toString() },
              {
                status: AuctionItemStatus.CLOSED,
              },
            );
            break;
          }
          case 'DistributedAuctionItem': {
            const { itemId } = event.args;
            await this.auctionItemsRepository.update(
              { onChainId: itemId.toString() },
              {
                status: AuctionItemStatus.SOLD,
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
