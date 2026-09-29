import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { WebSearch } from './entities/web-search.entity.js';
import { AIProvidersService } from '../ai-providers/ai-providers.service.js';

@Injectable()
export class WebSearchService {
  constructor(
    @InjectRepository(WebSearch)
    private readonly webSearchRepository: Repository<WebSearch>,
    private readonly aiProvidersService: AIProvidersService,
  ) {}

  // Search Query
  async searchQuery(userId: string, query: string) {
    if (!query || !query.trim()) {
      throw new BadRequestException('Search query is required');
    }

    const provider = await this.aiProvidersService.getProviderForChat('Google');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${provider.modelName}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': provider.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: query.trim() }],
            },
          ],
        //   tools: [{ google_search: {} }],
        }),
      },
    );

    if (!response.ok) {
      const errorDetails = await response.text();

      console.error('Gemini Search API Error:', response.status, errorDetails);

      throw new InternalServerErrorException('Web search request failed');
    }

    const data = await response.json();

    const candidate = data.candidates?.[0];

    const answer =
      candidate?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? '')
        .join('') ?? '';

    const groundingChunks = candidate?.groundingMetadata?.groundingChunks ?? [];

    const sources = groundingChunks
      .map((chunk: { web?: { uri?: string; title?: string } }) => chunk.web)
      .filter((web: { uri?: string; title?: string } | undefined) =>
        Boolean(web?.uri),
      )
      .map((web: { uri?: string; title?: string }) => ({
        title: web.title ?? '',
        url: web.uri!,
      }));

    const result = {
      query: query.trim(),
      answer,
      sources,
    };

    const search = this.webSearchRepository.create({
      query: query.trim(),
      results: JSON.stringify(result),
      user: { id: userId } as any,
    });

    await this.webSearchRepository.save(search);

    return {
      id: search.id,
      ...result,
      createdAt: search.createdAt,
    };
  }

  // Search History
  async getSearchHistory(userId: string) {
    const searches = await this.webSearchRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return searches.map((search) => ({
      id: search.id,
      query: search.query,
      results: search.results ? JSON.parse(search.results) : null,
      createdAt: search.createdAt,
    }));
  }

  // Recent Searches
  async getRecentSearches(userId: string, limit = 10) {
    const searches = await this.webSearchRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
      take: Math.min(Math.max(limit, 1), 50),
    });

    return searches.map((search) => ({
      id: search.id,
      query: search.query,
      createdAt: search.createdAt,
    }));
  }

  // Search Suggestions
  async getSearchSuggestions(userId: string, query: string) {
    if (!query?.trim()) {
      return [];
    }

    const searches = await this.webSearchRepository.find({
      where: {
        user: { id: userId },
        query: ILike(`%${query.trim()}%`),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });

    return [...new Set(searches.map((search) => search.query))];
  }
}
