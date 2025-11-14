import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { env } from '@config/env';
import { InteractionModel, type InteractionType } from '@models/interaction.model';

type EvalInteraction = {
  userId: string;
  productId: string;
  weight: number;
  type: InteractionType;
  createdAt: Date;
};

type UserEvalPayload = {
  train: EvalInteraction[];
  test: Set<string>;
  vector: Map<string, number>;
  magnitude: number;
};

type UserSummary = {
  userId: string;
  recommendations: number;
  relevant: number;
  hits: number;
  precision: number;
  recall: number;
  f1: number;
};

const POSITIVE_TYPES: InteractionType[] = ['like', 'purchase'];
const DEFAULT_LIMIT = 12;
const DEFAULT_HOLDOUT = 3;
const DEFAULT_MIN_TRAIN = 5;

function readNumericArg(flag: string, fallback: number) {
  const direct = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (direct) {
    const [, raw] = direct.split('=');
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  const index = process.argv.indexOf(flag);
  if (index >= 0 && process.argv[index + 1]) {
    const parsed = Number(process.argv[index + 1]);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

async function loadInteractionsFromMongo(): Promise<EvalInteraction[]> {
  await mongoose.connect(env.MONGO_URI);
  const records = await InteractionModel.find().sort({ createdAt: 1 }).lean();
  await mongoose.disconnect();
  return records.map((record) => ({
    userId: record.userId.toString(),
    productId: record.productId.toString(),
    weight: record.weight,
    type: record.type,
    createdAt: record.createdAt ?? new Date()
  }));
}

function generateSyntheticDataset(userCount = 24, productCount = 42): EvalInteraction[] {
  faker.seed(2024);
  const categories = ['Electronics', 'Books', 'Home', 'Fitness', 'Fashion', 'Outdoors', 'Beauty'];
  const products: string[] = [];
  const productsByCategory = new Map<string, string[]>();
  const popularByCategory = new Map<string, string[]>();
  const perCategory = Math.ceil(productCount / categories.length);
  categories.forEach((category) => {
    const bucket: string[] = [];
    for (let i = 0; i < perCategory; i++) {
      const id = faker.string.uuid();
      bucket.push(id);
      products.push(id);
    }
    productsByCategory.set(category, bucket);
    popularByCategory.set(category, bucket.slice(0, Math.max(3, Math.floor(bucket.length / 2))));
  });

  const users = Array.from({ length: userCount }, () => ({
    id: faker.string.uuid(),
    preferences: faker.helpers.arrayElements(categories, 3)
  }));

  const dataset: EvalInteraction[] = [];
  for (const user of users) {
    const interactionCount = faker.number.int({ min: 18, max: 32 });
    let cursor = Date.now() - faker.number.int({ min: 7, max: 21 }) * 24 * 60 * 60 * 1000;
    let positiveCount = 0;
    for (let i = 0; i < interactionCount; i++) {
      cursor += faker.number.int({ min: 3, max: 36 }) * 60 * 60 * 1000;
      const prefersCategory = faker.number.float({ min: 0, max: 1, fractionDigits: 4 }) < 0.7;
      const chosenCategory = prefersCategory
        ? faker.helpers.arrayElement(user.preferences)
        : faker.helpers.arrayElement(categories);
      const bucket = productsByCategory.get(chosenCategory) ?? products;
      const popularBucket = popularByCategory.get(chosenCategory) ?? bucket;
      const preferPopular = faker.number.float({ min: 0, max: 1, fractionDigits: 4 }) < 0.7;
      const productId = preferPopular
        ? faker.helpers.arrayElement(popularBucket)
        : faker.helpers.arrayElement(bucket);
      const typeRoll = faker.number.float({ min: 0, max: 1, fractionDigits: 4 });
      let type: InteractionType = 'view';
      let weight = 1;
      if (prefersCategory) {
        if (typeRoll >= 0.65) {
          type = 'purchase';
          weight = 5;
        } else if (typeRoll >= 0.35) {
          type = 'like';
          weight = 3;
        }
      } else if (typeRoll >= 0.9) {
        type = 'purchase';
        weight = 5;
      } else if (typeRoll >= 0.65) {
        type = 'like';
        weight = 3;
      }
      if (POSITIVE_TYPES.includes(type)) {
        positiveCount += 1;
      }
      dataset.push({
        userId: user.id,
        productId,
        type,
        weight,
        createdAt: new Date(cursor)
      });
    }
    if (positiveCount < DEFAULT_HOLDOUT) {
      for (let j = positiveCount; j < DEFAULT_HOLDOUT; j++) {
        cursor += faker.number.int({ min: 2, max: 8 }) * 60 * 60 * 1000;
        dataset.push({
          userId: user.id,
          productId: faker.helpers.arrayElement(productsByCategory.get(faker.helpers.arrayElement(user.preferences)) ?? products),
          type: faker.helpers.arrayElement(['like', 'purchase'] as InteractionType[]),
          weight: faker.helpers.arrayElement([3, 5]),
          createdAt: new Date(cursor)
        });
      }
    }
  }
  return dataset;
}

function buildUserPayloads(
  interactions: EvalInteraction[],
  holdoutCount: number,
  minTrainInteractions: number
): Map<string, UserEvalPayload> {
  const grouped = new Map<string, EvalInteraction[]>();
  interactions.forEach((interaction) => {
    if (!grouped.has(interaction.userId)) {
      grouped.set(interaction.userId, []);
    }
    grouped.get(interaction.userId)?.push(interaction);
  });

  const payloads = new Map<string, UserEvalPayload>();
  grouped.forEach((userInteractions, userId) => {
    const sorted = userInteractions.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
    const positiveIndexes = sorted
      .map((interaction, index) => (POSITIVE_TYPES.includes(interaction.type) ? index : -1))
      .filter((index) => index >= 0);
    if (!positiveIndexes.length) {
      return;
    }
    const holdoutIndexes = positiveIndexes.slice(-holdoutCount);
    const testItems = new Set<string>();
    holdoutIndexes.forEach((index) => {
      const interaction = sorted[index];
      if (interaction) {
        testItems.add(interaction.productId);
      }
    });
    const trainInteractions = sorted.filter((interaction) => !testItems.has(interaction.productId));
    if (testItems.size === 0 || trainInteractions.length < minTrainInteractions) {
      return;
    }
    const vector = new Map<string, number>();
    trainInteractions.forEach((interaction) => {
      vector.set(interaction.productId, (vector.get(interaction.productId) || 0) + interaction.weight);
    });
    const magnitude = Math.sqrt(
      Array.from(vector.values()).reduce((sum, value) => sum + value ** 2, 0)
    );
    if (vector.size === 0 || magnitude === 0) {
      return;
    }
    payloads.set(userId, { train: trainInteractions, test: testItems, vector, magnitude });
  });

  return payloads;
}

function recommendForUser(
  userId: string,
  payloads: Map<string, UserEvalPayload>,
  limit: number
) {
  const targetPayload = payloads.get(userId);
  if (!targetPayload) return [];
  const neighborScores: Array<[string, number]> = [];
  payloads.forEach((neighborPayload, neighborId) => {
    if (neighborId === userId) return;
    const dot = computeDotProduct(targetPayload.vector, neighborPayload.vector);
    if (dot <= 0) return;
    const score = dot / (targetPayload.magnitude * neighborPayload.magnitude || 1);
    if (score > 0) {
      neighborScores.push([neighborId, score]);
    }
  });
  neighborScores.sort((a, b) => b[1] - a[1]);
  const topNeighbors = neighborScores.slice(0, 30);
  if (!topNeighbors.length) {
    return [];
  }
  const seen = new Set(targetPayload.vector.keys());
  const candidateScores = new Map<string, number>();
  topNeighbors.forEach(([neighborId]) => {
    const neighborTrain = payloads.get(neighborId)?.train || [];
    neighborTrain.forEach((interaction) => {
      if (seen.has(interaction.productId)) return;
      candidateScores.set(
        interaction.productId,
        (candidateScores.get(interaction.productId) || 0) + interaction.weight
      );
    });
  });
  return Array.from(candidateScores.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function computeDotProduct(a: Map<string, number>, b: Map<string, number>) {
  let sum = 0;
  for (const [key, value] of a.entries()) {
    if (b.has(key)) {
      sum += value * (b.get(key) ?? 0);
    }
  }
  return sum;
}

function evaluateRecommendations(
  payloads: Map<string, UserEvalPayload>,
  limit: number
) {
  const summaries: UserSummary[] = [];
  let truePositives = 0;
  let predictedPositive = 0;
  let relevantPositive = 0;

  payloads.forEach((payload, userId) => {
    const recommendations = recommendForUser(userId, payloads, limit);
    if (!payload.test.size) return;
    const recommendedIds = new Set(recommendations.map((rec) => rec.id));
    const hits = Array.from(payload.test).filter((id) => recommendedIds.has(id)).length;
    const precision = recommendations.length ? hits / recommendations.length : 0;
    const recall = payload.test.size ? hits / payload.test.size : 0;
    const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
    summaries.push({
      userId,
      recommendations: recommendations.length,
      relevant: payload.test.size,
      hits,
      precision,
      recall,
      f1
    });
    truePositives += hits;
    predictedPositive += recommendations.length;
    relevantPositive += payload.test.size;
  });

  const macroPrecision =
    summaries.length === 0
      ? 0
      : summaries.reduce((sum, item) => sum + item.precision, 0) / summaries.length;
  const macroRecall =
    summaries.length === 0
      ? 0
      : summaries.reduce((sum, item) => sum + item.recall, 0) / summaries.length;
  const macroF1 =
    summaries.length === 0
      ? 0
      : summaries.reduce((sum, item) => sum + item.f1, 0) / summaries.length;

  const microPrecision = predictedPositive ? truePositives / predictedPositive : 0;
  const microRecall = relevantPositive ? truePositives / relevantPositive : 0;
  const microF1 =
    microPrecision + microRecall ? (2 * microPrecision * microRecall) / (microPrecision + microRecall) : 0;

  return {
    summaries,
    micro: { precision: microPrecision, recall: microRecall, f1: microF1 },
    macro: { precision: macroPrecision, recall: macroRecall, f1: macroF1 },
    totals: {
      evaluatedUsers: summaries.length,
      relevant: relevantPositive,
      predicted: predictedPositive,
      hits: truePositives
    }
  };
}

async function main() {
  const limit = readNumericArg('--limit', DEFAULT_LIMIT);
  const holdoutCount = readNumericArg('--holdout', DEFAULT_HOLDOUT);
  const minTrainInteractions = readNumericArg('--min-train', DEFAULT_MIN_TRAIN);
  const useSynthetic = hasFlag('--synthetic');
  const dataset = useSynthetic
    ? generateSyntheticDataset()
    : await loadInteractionsFromMongo();

  const payloads = buildUserPayloads(dataset, holdoutCount, minTrainInteractions);
  const { summaries, micro, macro, totals } = evaluateRecommendations(payloads, limit);
  if (!summaries.length) {
    console.warn('No users qualified for evaluation. Ensure there are enough interactions.');
    return;
  }
  const sample = summaries
    .sort((a, b) => b.f1 - a.f1)
    .slice(0, 5)
    .map((summary) => ({
      user: summary.userId.slice(0, 8),
      recs: summary.recommendations,
      relevant: summary.relevant,
      hits: summary.hits,
      precision: summary.precision.toFixed(2),
      recall: summary.recall.toFixed(2),
      f1: summary.f1.toFixed(2)
    }));

  console.log(
    `Evaluated ${totals.evaluatedUsers} users (${totals.relevant} relevant items) with top-${limit} recommendations` +
      (useSynthetic ? ' using synthetic dataset.' : '.')
  );
  console.table(sample);
  console.log('Micro averages:', formatAverages(micro));
  console.log('Macro averages:', formatAverages(macro));
}

function formatAverages(metrics: { precision: number; recall: number; f1: number }) {
  return {
    precision: metrics.precision.toFixed(3),
    recall: metrics.recall.toFixed(3),
    f1: metrics.f1.toFixed(3)
  };
}

main().catch((error) => {
  console.error('Failed to evaluate recommendations:', error);
  process.exitCode = 1;
});
