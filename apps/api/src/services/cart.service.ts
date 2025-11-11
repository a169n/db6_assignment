import { Types } from 'mongoose';
import { UserModel } from '@models/user.model';
import { ProductModel } from '@models/product.model';

type CartProduct = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  images: string[];
};

type PopulatedCartItem = {
  product: CartProduct;
  quantity: number;
};

export class CartService {
  private async requireUser(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return user;
  }

  private async getCart(userId: string) {
    const user = await UserModel.findById(userId).populate('cart.product');
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return (user.cart || []).map((item) => ({
      product: item.product as unknown as CartProduct,
      quantity: item.quantity
    }));
  }

  async list(userId: string) {
    return this.getCart(userId);
  }

  async addItem(userId: string, productId: string, quantity = 1) {
    const user = await this.requireUser(userId);
    const product = await ProductModel.findById(productId).select('_id');
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    const productObjectId = product._id as Types.ObjectId;
    const item = user.cart.find((entry) => entry.product.equals(productObjectId));
    if (item) {
      item.quantity += quantity;
    } else {
      user.cart.push({ product: productObjectId, quantity });
    }
    await user.save();
    return this.getCart(userId);
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const user = await this.requireUser(userId);
    const targetId = new Types.ObjectId(productId);
    const item = user.cart.find((entry) => entry.product.equals(targetId));
    if (!item) {
      throw new Error('CART_ITEM_NOT_FOUND');
    }
    if (quantity <= 0) {
      user.cart = user.cart.filter((entry) => !entry.product.equals(targetId));
    } else {
      item.quantity = quantity;
    }
    await user.save();
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const user = await this.requireUser(userId);
    const targetId = new Types.ObjectId(productId);
    const newCart = user.cart.filter((entry) => !entry.product.equals(targetId));
    if (newCart.length === user.cart.length) {
      throw new Error('CART_ITEM_NOT_FOUND');
    }
    user.cart = newCart;
    await user.save();
    return this.getCart(userId);
  }
}
