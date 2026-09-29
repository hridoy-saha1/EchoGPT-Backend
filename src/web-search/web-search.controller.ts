import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { WebSearchService } from './web-search.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
@Controller('web-search')
@UseGuards(JwtAuthGuard)
export class WebSearchController {
  constructor(private readonly webSearchService: WebSearchService) {}

  // Search Query
  @Post('search')
  async searchQuery(
    @Req() req: { user: { id: string } },
    @Body('query') query: string,
  ) {
    return this.webSearchService.searchQuery(req.user.id, query);
  }

  // Search History
  @Get('history')
  async getSearchHistory(@Req() req: { user: { id: string } }) {
    return this.webSearchService.getSearchHistory(req.user.id);
  }

  // Recent Searches
  @Get('recent')
  async getRecentSearches(
    @Req() req: { user: { id: string } },
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ) {
    return this.webSearchService.getRecentSearches(req.user.id, limit);
  }

  // Search Suggestions
  @Get('suggestions')
  async getSearchSuggestions(
    @Req() req: { user: { id: string } },
    @Query('query') query: string,
  ) {
    return this.webSearchService.getSearchSuggestions(req.user.id, query);
  }
}
