import type { FastifyInstance } from 'fastify';
import { SearchController } from '@controllers/search.controller';
import { SearchService } from '@services/search.service';

export default async function searchRoutes(app: FastifyInstance) {
  const controller = new SearchController(new SearchService());
  app.get('/search', controller.search);
}
