import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { AIProvidersService } from './ai-providers.service.js';
import {
  CreateAIProviderDto,
  UpdateAIProviderDto,
} from './dto/create-ai-provider.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('ai-providers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AIProvidersController {
  constructor(private readonly aiProvidersService: AIProvidersService) {}

  @Post()
  create(@Body() dto: CreateAIProviderDto) {
    return this.aiProvidersService.create(dto);
  }

  @Get('allAIProviders')
  findAllAiProviders() {
    return this.aiProvidersService.findAllAiProviders();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateAIProviderDto) {
    return this.aiProvidersService.updateAiProvider(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.aiProvidersService.deleteAiProvider(id);
  }

  @Patch(':id/enable')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('admin')
  enableAiProvider(@Param('id') id: string) {
    return this.aiProvidersService.toggleAiProviderStatus(id, true);
  }

  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('admin')
  disableAiProvider(@Param('id') id: string) {
    return this.aiProvidersService.toggleAiProviderStatus(id, false);
  }

  @Patch(':id/set-default')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('admin')
  setDefaultAiProvider(@Param('id') id: string) {
    return this.aiProvidersService.setDefaultProvider(id);
  }

  @Get(':id/health')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('admin')
  providerHealthCheck(@Param('id') id: string) {
    return this.aiProvidersService.providerHealthCheck(id);
  }
}
