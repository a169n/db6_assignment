import { seedDatabase } from './seed-data';

seedDatabase()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seed data inserted');
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
