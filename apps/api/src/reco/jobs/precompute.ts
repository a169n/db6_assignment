import { app } from '../../index';
import { RecommendationService } from '../recommendation.service';
import { UserModel } from '@models/user.model';

async function run() {
  await app.ready();
  const service = new RecommendationService(app);
  const users = await UserModel.find().select('_id');
  for (const user of users) {
    await service.getRecommendations(user.id, 'user', 20);
    await service.getRecommendations(user.id, 'item', 20);
  }
  await app.close();
  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
