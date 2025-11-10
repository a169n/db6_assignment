import { initializeApp, shutdownApp } from '../../index';
import { RecommendationService } from '../recommendation.service';
import { UserModel } from '@models/user.model';

async function run() {
  await initializeApp();
  const service = new RecommendationService();
  const users = await UserModel.find().select('_id');
  for (const user of users) {
    await service.getRecommendations(user.id, 'user', 20);
    await service.getRecommendations(user.id, 'item', 20);
  }
  await shutdownApp();
  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
