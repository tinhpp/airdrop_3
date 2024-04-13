import { BlockRedisService } from './redis/block.redis.provider';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [BlockRedisService],
  exports: [EventEmitterModule, BlockRedisService],
})
export class ConnectionsModule {}
