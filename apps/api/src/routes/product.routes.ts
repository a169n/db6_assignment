import type { FastifyInstance } from 'fastify';
import { ProductController } from '@controllers/product.controller';
import { ProductService } from '@services/product.service';

export default async function productRoutes(app: FastifyInstance) {
  const controller = new ProductController(new ProductService());

  app.get('/products', controller.list);
  app.get('/products/:slug', controller.get);
  app.post('/products', { preValidation: [app.authenticate, app.requireAdmin] }, controller.create);
  app.patch('/products/:id', { preValidation: [app.authenticate, app.requireAdmin] }, controller.update);
}
