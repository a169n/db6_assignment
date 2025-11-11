import { Types } from 'mongoose';
import { UserModel } from '@models/user.model';
import { ProductModel, type ProductDocument } from '@models/product.model';

export class FavoriteService {
  private async getUserWithFavorites(userId: string) {
    const user = await UserModel.findById(userId).populate('favorites');
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return (user.favorites || []) as unknown as ProductDocument[];
  }

  async list(userId: string) {
    return this.getUserWithFavorites(userId);
  }

  async add(userId: string, productId: string) {
    const product = await ProductModel.findById(productId).select('_id');
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    const productObjectId = product._id as Types.ObjectId;
    const alreadyFavorite = user.favorites.some((fav) => fav.equals(productObjectId));
    if (!alreadyFavorite) {
      user.favorites.push(productObjectId);
      await user.save();
    }
    return this.getUserWithFavorites(userId);
  }

  async remove(userId: string, productId: string) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: new Types.ObjectId(productId) } },
      { new: false }
    );
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return this.getUserWithFavorites(userId);
  }
}
