import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from './entities/user-subscription.entity.js';
import { Subscription } from '../subscriptions/entities/subscription.entity.js';
import { User } from '../users/entities/user.entity.js';
import { UserSubscriptionsService } from './user-subscriptions.service.js';
import { UserSubscriptionsController } from './user-subscriptions.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSubscription, Subscription, User]),
  ],
  controllers: [UserSubscriptionsController],
  providers: [UserSubscriptionsService],
  exports: [UserSubscriptionsService],
})
export class UserSubscriptionsModule {}