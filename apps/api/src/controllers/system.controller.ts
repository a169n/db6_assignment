import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { metricsStore } from '@lib/metrics';

export class SystemController {
  health = async (_request: Request, response: Response) => {
    return response.json({ status: 'ok', mongo: mongoose.connection.readyState });
  };

  ready = async (_request: Request, response: Response) => {
    const ready = mongoose.connection.readyState === 1;
    return response.status(ready ? 200 : 503).json({ ready });
  };

  metrics = async (_request: Request, response: Response) => {
    return response.json(metricsStore.toJSON());
  };
}
