import pino, { type TransportTargetOptions } from 'pino';
import { env } from './env';

function resolveDevTransport(): TransportTargetOptions | undefined {
  if (env.NODE_ENV === 'production') {
    return undefined;
  }
  try {
    require.resolve('pino-pretty');
    return { target: 'pino-pretty' };
  } catch {
    return undefined;
  }
}

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: resolveDevTransport(),
  redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers', 'password']
});
