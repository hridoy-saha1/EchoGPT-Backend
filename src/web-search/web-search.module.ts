import { Module } from '@nestjs/common';
import { WebSearchController } from './web-search.controller.js';
import { WebSearchService } from './web-search.service.js';

@Module({
  controllers: [WebSearchController],
  providers: [WebSearchService]
})
export class WebSearchModule {}
