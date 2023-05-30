import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientOpts } from 'redis';
import { CacheService } from './cache.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register<ClientOpts>({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      ttl: 60,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheConfigModule {}
