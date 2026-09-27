import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Req,
} from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service.js';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('user-subscriptions')
export class UserSubscriptionsController {
  constructor(private userSubscriptionsService: UserSubscriptionsService) {}

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createUserSubscription(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateUserSubscriptionDto,
  ) {
    return this.userSubscriptionsService.createUserSubscription(
      req.user.id,
      dto,
    );
  }

  @Get('my-subscription')
  @UseGuards(JwtAuthGuard)
  getMySubscription(@Request() req: { user: { id: string } }) {
    return this.userSubscriptionsService.getMySubscription(req.user.id);
  }

  @Post('use-request')
  @UseGuards(JwtAuthGuard)
  async useRequest(@Request() req: { user: { id: string } }) {
    return this.userSubscriptionsService.useRequest(req.user.id);
  }

  @Get('remaining-requests')
  @UseGuards(JwtAuthGuard)
  getRemainingRequests(@Req() req: { user: { id: string } }) {
    return this.userSubscriptionsService.getRemainingRequests(req.user.id);
  }
}
