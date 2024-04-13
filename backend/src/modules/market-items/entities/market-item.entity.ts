import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MarketItemStatus } from '../enums/market-item.enum';

@Index(['id', 'owner'])
@Entity('market_items')
export class MarketItem {
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
    enum: MarketItemStatus,
    default: MarketItemStatus.PENDING,
  })
  status: MarketItemStatus;

  @Column({ nullable: false })
  price: string;

  @Column({ nullable: true })
  timeSaleStart: string;

  @Column({ nullable: true })
  timeSaleEnd: string;

  @Column({ nullable: true })
  salePrice: string;

  @Column({ nullable: true })
  tx: string;

  @Column({ nullable: true })
  onChainId: string;

  @Column({ nullable: true })
  buyer: string;

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
