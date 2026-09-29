import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity.js';
import { UserSubscription } from '../user-subscriptions/entities/user-subscription.entity.js';

import { WebSearch } from '../web-search/entities/web-search.entity.js';
import { AIProvider } from '../ai-providers/ai-provider.entity.js';
import { ChatHistory } from '../chat/entities/chat-history.entity/chat-history.entity.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,

    @InjectRepository(AIProvider)
    private readonly aiProviderRepository: Repository<AIProvider>,

    @InjectRepository(ChatHistory)
    private readonly chatHistoryRepository: Repository<ChatHistory>,

    @InjectRepository(WebSearch)
    private readonly webSearchRepository: Repository<WebSearch>,
  ) {}

  // ==============================
  // Dashboard Statistics
  // ==============================

  async getDashboardStats() {
    const [
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalAIProviders,
      enabledAIProviders,
      totalChatMessages,
      totalWebSearches,
    ] = await Promise.all([
      this.userRepository.count(),

      this.userSubscriptionRepository.count(),

      this.userSubscriptionRepository.count({
        where: { status: 'active' },
      }),

      this.aiProviderRepository.count(),

      this.aiProviderRepository.count({
        where: { isEnabled: true },
      }),

      this.chatHistoryRepository.count(),

      this.webSearchRepository.count(),
    ]);

    return {
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalAIProviders,
      enabledAIProviders,
      totalChatMessages,
      totalWebSearches,
    };
  }

  // ==============================
  // User Management
  // ==============================

  // Get all users with pagination
  async getAllUsers(page = 1, limit = 10) {
    page = Math.max(1, page);
    limit = Math.min(100, Math.max(1, limit));

    const [users, total] = await this.userRepository.findAndCount({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get user by ID
  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Update user name and email
  async updateUser(
    id: string,
    data: { name?: string; email?: string },
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.name !== undefined) {
      user.name = data.name;
    }

    if (data.email !== undefined) {
      user.email = data.email;
    }

    return this.userRepository.save(user);
  }

  // Update user role
  async updateUserRole(id: string, role: string) {
    const allowedRoles = ['user', 'admin'];

    if (!allowedRoles.includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;

    return this.userRepository.save(user);
  }

  // Delete user
  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);

    return {
      message: 'User deleted successfully',
    };
  }
}