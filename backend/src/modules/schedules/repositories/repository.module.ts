import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { Crawl } from './crawl.repository';

@Module({
  imports: [ConnectionsModule],
  providers: [Crawl],
  exports: [Crawl],
})
export class RepositoryModule {}
