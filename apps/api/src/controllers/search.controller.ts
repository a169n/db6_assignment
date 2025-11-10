import type { Request, Response } from 'express';
import { SearchService } from '@services/search.service';
import { searchSchema } from '@schemas/search.schema';

export class SearchController {
  constructor(private readonly service: SearchService) {}

  search = async (request: Request, response: Response) => {
    const params = searchSchema.parse(request.query);
    const results = await this.service.search(params);
    return response.json(results);
  };
}
