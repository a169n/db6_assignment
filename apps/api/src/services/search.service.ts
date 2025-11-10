import { ProductModel } from '@models/product.model';
import { Types } from 'mongoose';

export class SearchService {
  async search(params: {
    q: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit: number;
    cursor?: string;
  }) {
    const filters: Record<string, any> = {};
    if (params.category) filters.category = params.category;
    if (params.minPrice || params.maxPrice) {
      filters.price = {};
      if (params.minPrice) filters.price.$gte = params.minPrice;
      if (params.maxPrice) filters.price.$lte = params.maxPrice;
    }

    if (params.q) {
      filters.$text = { $search: params.q };
    }

    if (params.cursor) {
      filters._id = { $lt: new Types.ObjectId(params.cursor) };
    }

    const items = await ProductModel.find(filters)
      .sort({ _id: -1 })
      .limit(params.limit + 1);

    const hasMore = items.length > params.limit;
    const results = hasMore ? items.slice(0, -1) : items;
    const nextCursor = hasMore ? results[results.length - 1]._id.toString() : null;

    return {
      results,
      nextCursor,
      count: results.length
    };
  }
}
