import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscription } from './entities/user-subscription.entity.js';
import { Subscription } from '../subscriptions/entities/subscription.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto.js';

@Injectable()
export class UserSubscriptionsService {
  constructor(
    @InjectRepository(UserSubscription)
    private userSubscriptionRepository: Repository<UserSubscription>,

    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUserSubscription(userId: string, dto: CreateUserSubscriptionDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { id: dto.subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription plan not found');
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + subscription.duration);

    const userSubscription = this.userSubscriptionRepository.create({
      user,
      subscription,
      startDate,
      endDate,
      status: 'active',
      usedRequests: 0,
    });

    const data = await this.userSubscriptionRepository.save(userSubscription);

    return {
      message: 'Subscription purchased successfully',
      data,
    };
  }

  async getMySubscription(userId: string) {
    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: { id: userId },
        status: 'active',
      },
      relations: {
        user: true,
        subscription: true,
      },
    });

    if (!userSubscription) {
      throw new NotFoundException('No active subscription found');
    }

    return userSubscription;
  }

  async useRequest(userId: string) {
    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: {
        user: { id: userId },
        status: 'active',
      },
      relations: {
        subscription: true,
      },
    });

    if (!userSubscription) {
      throw new NotFoundException('No active subscription found');
    }

    if (new Date() > userSubscription.endDate) {
      throw new ForbiddenException('Your subscription has expired');
    }

    if (
      userSubscription.usedRequests >=
      userSubscription.subscription.requestLimit
    ) {
      throw new ForbiddenException('Request limit exceeded');
    }

    userSubscription.usedRequests += 1;

    await this.userSubscriptionRepository.save(userSubscription);

    return {
      message: 'Request usage updated successfully',
      usedRequests: userSubscription.usedRequests,
      requestLimit: userSubscription.subscription.requestLimit,
    };
  }
}
