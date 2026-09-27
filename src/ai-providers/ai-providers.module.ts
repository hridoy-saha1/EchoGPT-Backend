import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIProvider } from './ai-provider.entity.js';
import { AIProvidersService } from './ai-providers.service.js';
import { AIProvidersController } from './ai-providers.controller.js';
import { EncryptionService } from './encryption.service.js';


@Module({
  imports: [TypeOrmModule.forFeature([AIProvider])],
  controllers: [AIProvidersController],
  providers: [AIProvidersService, EncryptionService],
  exports: [AIProvidersService, EncryptionService],
})
export class AIProvidersModule {}