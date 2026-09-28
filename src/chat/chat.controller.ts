import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto/send-message.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(
    @Req() req: { user: { id: string } },
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(req.user.id, dto);
  }

  @Get('history')
  async getConversationHistory(@Req() req: { user: { id: string } }) {
    return this.chatService.getConversationHistory(req.user.id);
  }

  @Get('history/:conversationId')
  async getConversationById(
    @Param('conversationId') conversationId: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.chatService.getConversationById(req.user.id, conversationId);
  }
}
