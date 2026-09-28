import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AIProvider } from './ai-provider.entity.js';
import {
  CreateAIProviderDto,
  UpdateAIProviderDto,
} from './dto/create-ai-provider.dto.js';
import { EncryptionService } from './encryption.service.js';

@Injectable()
export class AIProvidersService {
  constructor(
    @InjectRepository(AIProvider)
    private readonly aiProviderRepository: Repository<AIProvider>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(dto: CreateAIProviderDto) {
    const encryptedApiKey = this.encryptionService.encrypt(dto.apiKey);

    const provider = this.aiProviderRepository.create({
      providerName: dto.providerName,
      modelName: dto.modelName,
      apiKeyEncrypted: encryptedApiKey,
      isEnabled: true,
      isDefault: false,
    });

    const savedProvider = await this.aiProviderRepository.save(provider);

    return {
      message: 'AI Provider created successfully',
      provider: {
        id: savedProvider.id,
        providerName: savedProvider.providerName,
        modelName: savedProvider.modelName,
        isEnabled: savedProvider.isEnabled,
        isDefault: savedProvider.isDefault,
      },
    };
  }
  async findAllAiProviders() {
    return this.aiProviderRepository.find({
      select: {
        id: true,
        providerName: true,
        modelName: true,
        isEnabled: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateAiProvider(id: string, dto: UpdateAIProviderDto) {
    const provider = await this.aiProviderRepository.findOne({
      where: { id },
    });

    if (!provider) {
      throw new NotFoundException('AI Provider not found');
    }

    if (dto.providerName !== undefined) {
      provider.providerName = dto.providerName;
    }

    if (dto.modelName !== undefined) {
      provider.modelName = dto.modelName;
    }

    if (dto.apiKey !== undefined) {
      provider.apiKeyEncrypted = this.encryptionService.encrypt(dto.apiKey);
    }

    const updatedProvider = await this.aiProviderRepository.save(provider);

    return {
      message: 'AI Provider updated successfully',
      provider: {
        id: updatedProvider.id,
        providerName: updatedProvider.providerName,
        modelName: updatedProvider.modelName,
        isEnabled: updatedProvider.isEnabled,
        isDefault: updatedProvider.isDefault,
      },
    };
  }

  async deleteAiProvider(id: string) {
    const provider = await this.aiProviderRepository.findOne({
      where: { id },
    });

    if (!provider) {
      throw new NotFoundException('AI Provider not found');
    }

    await this.aiProviderRepository.remove(provider);

    return {
      message: 'AI Provider deleted successfully',
    };
  }

  async toggleAiProviderStatus(id: string, isEnabled: boolean) {
    const provider = await this.aiProviderRepository.findOne({
      where: { id },
    });

    if (!provider) {
      throw new NotFoundException('AI Provider not found');
    }

    provider.isEnabled = isEnabled;

    const updatedProvider = await this.aiProviderRepository.save(provider);

    return {
      message: `AI Provider ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      provider: {
        id: updatedProvider.id,
        providerName: updatedProvider.providerName,
        modelName: updatedProvider.modelName,
        isEnabled: updatedProvider.isEnabled,
        isDefault: updatedProvider.isDefault,
      },
    };
  }

  async setDefaultProvider(id: string) {
    const provider = await this.aiProviderRepository.findOne({
      where: { id },
    });

    if (!provider) {
      throw new NotFoundException('AI Provider not found');
    }

    if (!provider.isEnabled) {
      throw new BadRequestException(
        'Cannot set a disabled provider as default',
      );
    }

    await this.aiProviderRepository.update(
      { isDefault: true },
      { isDefault: false },
    );

    provider.isDefault = true;

    const updatedProvider = await this.aiProviderRepository.save(provider);

    return {
      message: 'Default AI Provider updated successfully',
      provider: {
        id: updatedProvider.id,
        providerName: updatedProvider.providerName,
        modelName: updatedProvider.modelName,
        isEnabled: updatedProvider.isEnabled,
        isDefault: updatedProvider.isDefault,
      },
    };
  }

  async providerHealthCheck(id: string) {
    const provider = await this.aiProviderRepository
      .createQueryBuilder('provider')
      .addSelect('provider.apiKeyEncrypted')
      .where('provider.id = :id', { id })
      .getOne();

    if (!provider) {
      throw new NotFoundException('AI Provider not found');
    }
    const apiKey = this.encryptionService.decrypt(provider.apiKeyEncrypted);
    if (provider.providerName === 'OpenAI') {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        return {
          providerName: provider.providerName,
          modelName: provider.modelName,
          status: 'unhealthy',
          message: 'OpenAI API connection failed',
        };
      }

      return {
        providerName: provider.providerName,
        modelName: provider.modelName,
        status: 'healthy',
        message: 'OpenAI API connection successful',
      };
    }
    if (provider.providerName === 'Anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/models', {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      });

      return {
        providerName: provider.providerName,
        modelName: provider.modelName,
        status: response.ok ? 'healthy' : 'unhealthy',
        message: response.ok
          ? 'Anthropic API connection successful'
          : 'Anthropic API connection failed',
      };
    }
    if (provider.providerName === 'Google') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        {
          method: 'GET',
        },
      );

      return {
        providerName: provider.providerName,
        modelName: provider.modelName,
        status: response.ok ? 'healthy' : 'unhealthy',
        message: response.ok
          ? 'Google Gemini API connection successful'
          : 'Google Gemini API connection failed',
      };
    }
    if (!provider.isEnabled) {
      throw new BadRequestException('AI Provider is disabled');
    }

    return {
      providerName: provider.providerName,
      modelName: provider.modelName,
      status: 'configured',
      message: 'Provider is enabled and configured',
    };
  }

  async getProviderForChat(providerName: string) {
    const provider = await this.aiProviderRepository
      .createQueryBuilder('provider')
      .addSelect('provider.apiKeyEncrypted')
      .where('provider.providerName = :providerName', {
        providerName,
      })
      .andWhere('provider.isEnabled = :isEnabled', {
        isEnabled: true,
      })
      .getOne();

    if (!provider) {
      throw new NotFoundException('AI Provider not found or disabled');
    }

    return {
      id: provider.id,
      providerName: provider.providerName,
      modelName: provider.modelName,
      apiKey: this.encryptionService.decrypt(provider.apiKeyEncrypted),
    };
  }
}
