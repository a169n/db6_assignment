import type { FastifyReply, FastifyRequest } from 'fastify';
import mongoose from 'mongoose';
import { metricsStore } from '@lib/metrics';

export class SystemController {
  health = async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ status: 'ok', mongo: mongoose.connection.readyState });
  };

  ready = async (_request: FastifyRequest, reply: FastifyReply) => {
    const ready = mongoose.connection.readyState === 1;
    return reply.status(ready ? 200 : 503).send({ ready });
  };

  metrics = async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send(metricsStore.toJSON());
  };
}
