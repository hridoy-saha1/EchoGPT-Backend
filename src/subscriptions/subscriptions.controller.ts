import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service.js';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { UpdateSubscriptionDto } from './dto/create-subscription.dto.js';
import { Roles } from '../auth/roles.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(dto);
  }

  @Get()
  
  getAllSubscriptions() {
    return this.subscriptionsService.getAllSubscriptions();
  }

  @Get(':id')
 
  getSubscriptionById(@Param('id') id: string) {
    return this.subscriptionsService.getSubscriptionById(id);
  }

  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateSubscription(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.updateSubscription(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteSubscription(@Param('id') id: string) {
    return this.subscriptionsService.deleteSubscription(id);
  }
}
