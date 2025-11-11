import type { Request, Response } from 'express';
import { ProductService } from '@services/product.service';
import { createProductSchema, updateProductSchema, listProductsSchema } from '@schemas/product.schema';

export class ProductController {
  constructor(private readonly service: ProductService) {}

  list = async (request: Request, response: Response) => {
    const { page, limit } = listProductsSchema.parse(request.query);
    const { items, total } = await this.service.list(page, limit);
    return response.json({ items, total, page, limit });
  };

  get = async (request: Request, response: Response) => {
    const { slug } = request.params as { slug: string };
    const product = await this.service.getBySlug(slug);
    if (!product) {
      return response.status(404).json({ error: 'NOT_FOUND' });
    }
    return response.json({ product });
  };

  create = async (request: Request, response: Response) => {
    const data = createProductSchema.parse(request.body);
    const product = await this.service.create(data);
    return response.status(201).json({ product });
  };

  update = async (request: Request, response: Response) => {
    const data = updateProductSchema.parse(request.body);
    const { id } = request.params as { id: string };
    const product = await this.service.update(id, data);
    if (!product) {
      return response.status(404).json({ error: 'NOT_FOUND' });
    }
    return response.json({ product });
  };

  categories = async (_request: Request, response: Response) => {
    const categories = await this.service.listCategories();
    return response.json({ categories });
  };
}
