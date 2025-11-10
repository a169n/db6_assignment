import type { FastifyReply, FastifyRequest } from 'fastify';
import { ProductService } from '@services/product.service';
import { createProductSchema, updateProductSchema, listProductsSchema } from '@schemas/product.schema';

export class ProductController {
  constructor(private readonly service: ProductService) {}

  list = async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = listProductsSchema.parse(request.query);
    const { items, total } = await this.service.list(page, limit);
    return { items, total, page, limit };
  };

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const slug = (request.params as { slug: string }).slug;
    const product = await this.service.getBySlug(slug);
    if (!product) {
      return reply.status(404).send({ error: 'NOT_FOUND' });
    }
    return { product };
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = createProductSchema.parse(request.body);
    const product = await this.service.create(data);
    return reply.status(201).send({ product });
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = updateProductSchema.parse(request.body);
    const { id } = request.params as { id: string };
    const product = await this.service.update(id, data);
    if (!product) {
      return reply.status(404).send({ error: 'NOT_FOUND' });
    }
    return { product };
  };
}
