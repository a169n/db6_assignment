import type { Application } from 'express';
import { Router } from 'express';
import { ProductController } from '@controllers/product.controller';
import { ProductService } from '@services/product.service';
import { authenticate, requireAdmin } from '@middleware/auth';
import { asyncHandler } from '@utils/async-handler';

export function registerProductRoutes(app: Application) {
  const controller = new ProductController(new ProductService());

  const router = Router();
  router.get('/', asyncHandler(controller.list));
  router.get('/categories', asyncHandler(controller.categories));
  router.get('/:slug', asyncHandler(controller.get));
  router.post('/', authenticate, requireAdmin, asyncHandler(controller.create));
  router.patch('/:id', authenticate, requireAdmin, asyncHandler(controller.update));

  app.use('/products', router);
}
