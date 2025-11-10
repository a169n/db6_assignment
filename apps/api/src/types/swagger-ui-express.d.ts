declare module 'swagger-ui-express' {
  import type { RequestHandler } from 'express';

  export const serve: RequestHandler[];

  export function setup(
    swaggerDoc?: Record<string, unknown>,
    customOptions?: Record<string, unknown>,
    options?: Record<string, unknown>,
    customCss?: string,
    customfavIcon?: string,
    swaggerUrl?: string
  ): RequestHandler;

  const swaggerUiExpress: {
    serve: typeof serve;
    setup: typeof setup;
  };

  export default swaggerUiExpress;
}
