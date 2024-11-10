import type { Hook } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { UNPROCESSABLE_ENTITY } from 'stoker/http-status-codes';
import packageJSON from '../../package.json';
import type { AppOpenAPI } from './types';

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'Tasks API',
    },
  });

  // Scalar interactive documentation.
  app.get(
    '/scalar',
    apiReference({
      // make the default options in the documentation use JS fetch within scalar.
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch',
      },
      layout: 'classic',
      pageTitle: 'API Documentation',
      theme: 'bluePlanet',
      spec: {
        url: '/doc',
      },
    }),
  );
}

export const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json({
      success: result.success,
      error: result.error,
    }, UNPROCESSABLE_ENTITY);
  }
};
