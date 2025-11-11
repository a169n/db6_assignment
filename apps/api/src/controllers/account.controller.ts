import type { Response } from 'express';
import type { AuthenticatedRequest } from '@app-types/request';
import { favoriteProductSchema } from '@schemas/favorite.schema';
import { upsertCartItemSchema, updateCartItemSchema } from '@schemas/cart.schema';
import { FavoriteService } from '@services/favorite.service';
import { CartService } from '@services/cart.service';

export class AccountController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly cartService: CartService
  ) {}

  listFavorites = async (request: AuthenticatedRequest, response: Response) => {
    const userId = this.requireUser(request, response);
    if (!userId) return undefined;
    try {
      const favorites = await this.favoriteService.list(userId);
      return response.json({ favorites: favorites.map((product) => this.serializeProduct(product)) });
    } catch (error) {
      return this.handleServiceError(response, error);
    }
  };

  addFavorite = async (request: AuthenticatedRequest, response: Response) => {
    const userId = this.requireUser(request, response);
    if (!userId) return undefined;
    const { productId } = favoriteProductSchema.parse(request.body);
    try {
      const favorites = await this.favoriteService.add(userId, productId);
      return response.status(201).json({ favorites: favorites.map((product) => this.serializeProduct(product)) });
    } catch (error) {
      return this.handleServiceError(response, error);
    }
  };

  removeFavorite = async (request: AuthenticatedRequest, response: Response) => {
    const userId = this.requireUser(request, response);
    if (!userId) return undefined;
    const { productId } = favoriteProductSchema.parse(request.params);
    try {
      const favorites = await this.favoriteService.remove(userId, productId);
      return response.json({ favorites: favorites.map((product) => this.serializeProduct(product)) });
    } catch (error) {
      return this.handleServiceError(response, error);
    }
  };

  getCart = async (request: AuthenticatedRequest, response: Response) => {
    const userId = this.requireUser(request, response);
    if (!userId) return undefined;
    try {
      const cart = await this.cartService.list(userId);
      return response.json({ items: this.serializeCart(cart) });
    } catch (error) {
      return this.handleServiceError(response, error);
    }
  };

  addToCart = async (request: AuthenticatedRequest, response: Response) => {
    const userId = this.requireUser(request, response);
    if (!userId) return undefined;
    const { productId, quantity } = upsertCartItemSchema.parse(request.body);
    try {
      const cart = await this.cartService.addItem(userId, productId, quantity ?? 1);
      return response.status(201).json({ items: this.serializeCart(cart) });
    } catch (error) {
      return this.handleServiceError(response, error);
    }
  };

  updateCartItem = async (request: AuthenticatedRequest, response: Response) => {
    const userId = this.requireUser(request, response);
    if (!userId) return undefined;
    const { productId } = favoriteProductSchema.parse(request.params);
    const { quantity } = updateCartItemSchema.parse(request.body);
    try {
      const cart = await this.cartService.updateQuantity(userId, productId, quantity);
      return response.json({ items: this.serializeCart(cart) });
    } catch (error) {
      return this.handleServiceError(response, error);
    }
  };

  removeCartItem = async (request: AuthenticatedRequest, response: Response) => {
    const userId = this.requireUser(request, response);
    if (!userId) return undefined;
    const { productId } = favoriteProductSchema.parse(request.params);
    try {
      const cart = await this.cartService.removeItem(userId, productId);
      return response.json({ items: this.serializeCart(cart) });
    } catch (error) {
      return this.handleServiceError(response, error);
    }
  };

  private requireUser(request: AuthenticatedRequest, response: Response) {
    const userId = request.user?.sub;
    if (!userId) {
      response.status(401).json({ error: 'UNAUTHORIZED' });
      return null;
    }
    return userId;
  }

  private serializeProduct(product: any) {
    if (!product) return null;
    return {
      _id: product._id?.toString?.() ?? product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: product.price,
      images: product.images || []
    };
  }

  private serializeCart(cart: Array<{ product: any; quantity: number }>) {
    return cart
      .filter((item) => Boolean(item.product))
      .map((item) => {
        const product = this.serializeProduct(item.product);
        return {
          product,
          quantity: item.quantity,
          subtotal: product ? Number(product.price) * item.quantity : 0
        };
      });
  }

  private handleServiceError(response: Response, error: unknown): Response | undefined {
    const message = (error as Error).message;
    if (message === 'PRODUCT_NOT_FOUND') {
      return response.status(404).json({ error: 'PRODUCT_NOT_FOUND' });
    }
    if (message === 'CART_ITEM_NOT_FOUND') {
      return response.status(404).json({ error: 'CART_ITEM_NOT_FOUND' });
    }
    if (message === 'USER_NOT_FOUND') {
      return response.status(401).json({ error: 'UNAUTHORIZED' });
    }
    throw error;
  }
}
