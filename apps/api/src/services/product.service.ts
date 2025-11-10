import { ProductModel } from '@models/product.model';
import { InteractionModel } from '@models/interaction.model';

export class ProductService {
  async list(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      ProductModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments()
    ]);
    return { items, total };
  }

  async getBySlug(slug: string) {
    return ProductModel.findOne({ slug });
  }

  async create(data: {
    name: string;
    slug: string;
    description: string;
    category: string;
    price: number;
    images: string[];
  }) {
    return ProductModel.create(data);
  }

  async update(
    id: string,
    data: Partial<{ name: string; slug: string; description: string; category: string; price: number; images: string[] }>
  ) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async trending(limit: number) {
    const interactions = await InteractionModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
          }
        }
      },
      {
        $group: {
          _id: '$productId',
          score: { $sum: '$weight' }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);
    return interactions.map((i) => ({ product: i.product, score: i.score }));
  }
}
