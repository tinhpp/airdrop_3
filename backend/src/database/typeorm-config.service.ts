import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('DATABASE_TYPE', { infer: true }),
      host: this.configService.get('DATABASE_HOST', { infer: true }),
      port: +this.configService.get('DATABASE_PORT', { infer: true }),
      username: this.configService.get('DATABASE_USERNAME', { infer: true }),
      password: this.configService.get('DATABASE_PASSWORD', { infer: true }),
      database: this.configService.get('DATABASE_NAME', { infer: true }),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      migration: true,
      autoLoadEntities: true,
    } as TypeOrmModuleOptions;
  }
}
