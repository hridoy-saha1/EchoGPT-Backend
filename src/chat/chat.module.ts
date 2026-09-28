import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatHistory } from './entities/chat-history.entity/chat-history.entity.js';
import { AIProvidersModule } from '../ai-providers/ai-providers.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ChatHistory,AIProvidersModule])],
  controllers: [ChatController],
  providers: [ChatService],
})

export class ChatModule {}
