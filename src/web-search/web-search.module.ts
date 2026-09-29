import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebSearch } from './entities/web-search.entity.js';
import { WebSearchController } from './web-search.controller.js';
import { WebSearchService } from './web-search.service.js';
import { AIProvidersModule } from '../ai-providers/ai-providers.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([WebSearch]), AIProvidersModule],
  controllers: [WebSearchController],
  providers: [WebSearchService],
})
export class WebSearchModule {}