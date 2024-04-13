import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuctionItemStatus } from '../enums/auction-item.enum';

@Index(['id', 'owner'])
@Entity('auction_items')
export class AuctionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nftAddress: string;

  @Column({ nullable: false })
  nftId: string;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: false })
  owner: string;

  @Column({
    type: 'enum',
    enum: AuctionItemStatus,
    default: AuctionItemStatus.PENDING,
  })
  status: AuctionItemStatus;

  @Column({ nullable: false })
  initPrice: string;

  @Column({ nullable: true })
  timeStart: string;

  @Column({ nullable: true })
  timeEnd: string;

  @Column({ nullable: true })
  onChainId: string;

  @Column('simple-json', { nullable: true })
  highestBidder: Record<string, any>;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
