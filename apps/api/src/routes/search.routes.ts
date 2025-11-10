import type { Application } from 'express';
import { SearchController } from '@controllers/search.controller';
import { SearchService } from '@services/search.service';
import { asyncHandler } from '@utils/async-handler';

export function registerSearchRoutes(app: Application) {
  const controller = new SearchController(new SearchService());

  app.get('/search', asyncHandler(controller.search));
}
