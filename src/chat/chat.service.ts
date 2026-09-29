import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatHistory } from './entities/chat-history.entity/chat-history.entity.js';
import { inject } from 'vitest';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dto/send-message.dto/send-message.dto.js';
import { AIProvidersService } from '../ai-providers/ai-providers.service.js';
import { randomUUID } from 'crypto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatHistory)
    private readonly chatHistoryRepository: Repository<ChatHistory>,
    private readonly aiProvidersService: AIProvidersService, // Replace 'any' with the actual type of your AIProvidersService
  ) {}

  async sendMessage(userId: string, dto: SendMessageDto) {
    const providerName = dto.providerName;

    if (!providerName) {
      throw new BadRequestException('Please select an AI Provider');
    }

    const provider =
      await this.aiProvidersService.getProviderForChat(providerName);

    const conversationId = dto.conversationId ?? randomUUID();
    const history = dto.conversationId
      ? await this.getConversationById(userId, dto.conversationId)
      : [];

    const aiResponse = await this.requestAIResponse(
      provider.providerName,
      provider.modelName,
      provider.apiKey,
      dto.message,
      history,
    );

    await this.chatHistoryRepository.save([
      {
        user: { id: userId },
        conversationId,
        role: 'user',
        content: dto.message,
        providerName: provider.providerName,
      },
      {
        user: { id: userId },
        conversationId,
        role: 'assistant',
        content: aiResponse,
        providerName: provider.providerName,
      },
    ]);

    return {
      userId,
      message: dto.message,
      providerName: provider.providerName,
      conversationId,
      aiResponse,
    };
  }

  async requestAIResponse(
    providerName: string,
    modelName: string,
    apiKey: string,
    message: string,
    history: { role: string; content: string }[],
  ) {
    if (providerName === 'OpenAI') {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              ...history.map((item) => ({
                role: item.role,
                content: item.content,
              })),
              {
                role: 'user',
                content: message,
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errorDetails = await response.text();

        console.error('OpenAI API Error:', response.status, errorDetails);

        throw new Error(`OpenAI API request failed: ${response.status}`);
      }
      const data = await response.json();

      return data.choices[0].message.content;
    }

    if (providerName === 'Anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelName,
          max_tokens: 1024,
          messages: [
            ...history.map((item) => ({
              role: item.role,
              content: item.content,
            })),
            {
              role: 'user',
              content: message,
            },
            1,
          ],
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();

        console.error('Anthropic API Error:', response.status, errorDetails);

        throw new Error(`Anthropic API request failed: ${response.status}`);
      }
      const data = await response.json();

      return data.content[0].text;
    }

    if (providerName === 'Google') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              ...history.map((item) => ({
                role: item.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: item.content }],
              })),
              {
                role: 'user',
                parts: [{ text: message }],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errorDetails = await response.text();

        console.error('Gemini API Error:', response.status, errorDetails);

        throw new Error(`Google Gemini API request failed: ${response.status}`);
      }
      const data = await response.json();

      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('Unsupported AI Provider');
  }

  async getConversationHistory(userId: string) {
    return this.chatHistoryRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async getConversationById(userId: string, conversationId: string) {
    return this.chatHistoryRepository.find({
      where: {
        user: { id: userId },
        conversationId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
