import type { FastifyReply, FastifyRequest } from 'fastify';
import { SearchService } from '@services/search.service';
import { searchSchema } from '@schemas/search.schema';

export class SearchController {
  constructor(private readonly service: SearchService) {}

  search = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = searchSchema.parse(request.query);
    const results = await this.service.search(params);
    return results;
  };
}
