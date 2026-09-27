import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIProvider } from './ai-provider.entity.js';
import { AiProvidersService } from './ai-providers.service.js';
import { AiProvidersController } from './ai-providers.controller.js';
import { EncryptionService } from './encryption.service.js';


@Module({
  imports: [TypeOrmModule.forFeature([AIProvider])],
  controllers: [AiProvidersController],
  providers: [AiProvidersService, EncryptionService],
  exports: [AiProvidersService, EncryptionService],
})
export class AIProvidersModule {}