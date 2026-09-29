import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';

import { User } from '../users/entities/user.entity.js';
import { UserSubscription } from '../user-subscriptions/entities/user-subscription.entity.js';

import { WebSearch } from '../web-search/entities/web-search.entity.js';
import { AIProvider } from '../ai-providers/ai-provider.entity.js';
import { ChatHistory } from '../chat/entities/chat-history.entity/chat-history.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSubscription,
      AIProvider,
      ChatHistory,
      WebSearch,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}