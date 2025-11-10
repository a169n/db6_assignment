import { randomUUID } from 'crypto';

export type MetricsSnapshot = {
  requestCount: number;
  cacheHits: number;
  cacheMisses: number;
  recoLatency: number[];
};

const metrics: MetricsSnapshot = {
  requestCount: 0,
  cacheHits: 0,
  cacheMisses: 0,
  recoLatency: []
};

export const metricsId = randomUUID();

export const metricsStore = {
  incRequest() {
    metrics.requestCount += 1;
  },
  recordCache(hit: boolean) {
    if (hit) metrics.cacheHits += 1;
    else metrics.cacheMisses += 1;
  },
  recordLatency(latency: number) {
    metrics.recoLatency.push(latency);
    if (metrics.recoLatency.length > 1000) {
      metrics.recoLatency.shift();
    }
  },
  toJSON() {
    const sorted = [...metrics.recoLatency].sort((a, b) => a - b);
    const p95 = sorted.length
      ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))]
      : 0;
    return {
      metricsId,
      requestCount: metrics.requestCount,
      cacheHitRate:
        metrics.cacheHits + metrics.cacheMisses === 0
          ? 0
          : metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses),
      recoP95: p95
    };
  }
};
