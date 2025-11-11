import type { Application } from 'express';
import { AccountController } from '@controllers/account.controller';
import { FavoriteService } from '@services/favorite.service';
import { CartService } from '@services/cart.service';
import { authenticate, csrfProtection } from '@middleware/auth';
import { asyncHandler } from '@utils/async-handler';

export function registerAccountRoutes(app: Application) {
  const controller = new AccountController(new FavoriteService(), new CartService());

  app.get('/me/favorites', authenticate, asyncHandler(controller.listFavorites));
  app.post('/me/favorites', authenticate, csrfProtection, asyncHandler(controller.addFavorite));
  app.delete('/me/favorites/:productId', authenticate, csrfProtection, asyncHandler(controller.removeFavorite));

  app.get('/me/cart', authenticate, asyncHandler(controller.getCart));
  app.post('/me/cart', authenticate, csrfProtection, asyncHandler(controller.addToCart));
  app.patch('/me/cart/:productId', authenticate, csrfProtection, asyncHandler(controller.updateCartItem));
  app.delete('/me/cart/:productId', authenticate, csrfProtection, asyncHandler(controller.removeCartItem));
}
