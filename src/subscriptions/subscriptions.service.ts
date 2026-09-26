import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity.js';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { UpdateSubscriptionDto } from './dto/create-subscription.dto.js';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
    ) {}

    async createSubscription(dto: CreateSubscriptionDto) {
        const subscription = this.subscriptionRepository.create(dto);
        const data = await this.subscriptionRepository.save(subscription);

        return {
            message: 'Subscription created successfully',
            data,
        };
    }

    async getAllSubscriptions() {
        const data = await this.subscriptionRepository.find();

        return {
            message: 'Subscriptions retrieved successfully',
            data,
        };
    }

    async getSubscriptionById(id: string) {
        const data = await this.subscriptionRepository.findOne({
            where: { id },
        });

        if (!data) {
            throw new NotFoundException('Subscription not found');
        }

        return {
            message: 'Subscription retrieved successfully',
            data,
        };
    }

    async updateSubscription(id: string, dto: UpdateSubscriptionDto) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id },
        });

        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }

        Object.assign(subscription, dto);
        const data = await this.subscriptionRepository.save(subscription);

        return {
            message: 'Subscription updated successfully',
            data,
        };
    }

    async deleteSubscription(id: string) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id },
        });

        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }

        await this.subscriptionRepository.remove(subscription);

        return {
            message: 'Subscription deleted successfully',
        };
    }
}