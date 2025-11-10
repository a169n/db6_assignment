import mongoose, { Types } from 'mongoose';
import { UserModel } from '@models/user.model';
import { ProductModel } from '@models/product.model';
import { InteractionModel } from '@models/interaction.model';
import { env } from '@config/env';
import { app } from '../index';
import { faker } from '@faker-js/faker';

const categories = ['Electronics', 'Books', 'Home', 'Fitness', 'Fashion', 'Outdoors', 'Beauty'];

function buildProducts() {
  const products = [] as any[];
  for (let i = 0; i < 60; i++) {
    const category = categories[i % categories.length];
    const name = `${category} Item ${i + 1}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    products.push({
      name,
      slug: `${slug}-${i}`,
      description: faker.commerce.productDescription(),
      category,
      price: Number(faker.commerce.price({ min: 10, max: 300 })),
      images: [faker.image.urlLoremFlickr({ category: 'product' })]
    });
  }
  return products;
}

function buildUsers() {
  const users = [] as any[];
  for (let i = 0; i < 25; i++) {
    users.push({
      email: `user${i + 1}@example.com`,
      password: 'Password123!',
      name: faker.person.fullName(),
      prefs: {
        categories: faker.helpers.arrayElements(categories, 3),
        priceRange: { min: 20, max: 200 }
      }
    });
  }
  users.push({
    email: 'admin@example.com',
    password: 'Password123!',
    name: 'Admin User',
    prefs: { categories: categories.slice(0, 3) },
    isAdmin: true
  });
  return users;
}

async function hashPasswords(users: any[]) {
  const { AuthService } = await import('@services/auth.service');
  const service = new AuthService(app);
  return Promise.all(
    users.map(async (user) => ({
      email: user.email,
      passwordHash: await service.hashPassword(user.password),
      name: user.name,
      prefs: user.prefs,
      isAdmin: user.isAdmin || false
    }))
  );
}

function buildInteractions(userIds: Types.ObjectId[], productIds: Types.ObjectId[]) {
  const interactions = [] as any[];
  const types: Array<'view' | 'like' | 'purchase'> = ['view', 'like', 'purchase'];
  for (const userId of userIds) {
    const products = faker.helpers.arrayElements(productIds, 15);
    for (const productId of products) {
      const type = faker.helpers.arrayElement(types);
      const weight = type === 'view' ? 1 : type === 'like' ? 3 : 5;
      interactions.push({
        userId,
        productId,
        type,
        weight,
        createdAt: faker.date.recent({ days: 30 })
      });
    }
  }
  return interactions;
}

export async function seedDatabase() {
  await mongoose.connect(env.MONGO_URI);
  await Promise.all([
    InteractionModel.deleteMany({}),
    ProductModel.deleteMany({}),
    UserModel.deleteMany({})
  ]);

  const products = buildProducts();
  const productDocs = await ProductModel.insertMany(products);

  const users = buildUsers();
  const hashedUsers = await hashPasswords(users);
  const userDocs = await UserModel.insertMany(hashedUsers);

  const interactions = buildInteractions(
    userDocs.map((u) => u._id),
    productDocs.map((p) => p._id)
  );
  await InteractionModel.insertMany(interactions);

  await mongoose.disconnect();
}
