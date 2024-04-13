import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import environment from './config/environment';
import { ConnectionsModule } from './connections/connections.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { CartsModule } from './modules/carts/carts.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AuctionItemsModule } from './modules/auction-items/auction-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [environment],
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ScheduleModule.forRoot(),
    ConnectionsModule,
    SchedulesModule,
    CartsModule,
    AuctionItemsModule,
  ],
  providers: [ConnectionsModule],
})
export class AppModule {}
