import { pinoLogger } from '@/middlewares/pino-loggers';
import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import { defaultHook } from './openApi';
import type { AppBindings, AppOpenAPI } from './types';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook, // if any validation errors, from any endpoint, respond same way.
  });
}

export default function createApp() {
  const app = createRouter();
  /** MiddleWares */
  app.use(pinoLogger());
  app.use(serveEmojiFavicon('📝'));

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
// create a test app with all of middlewhere and everything.
export function createTestApp(router: AppOpenAPI) {
  const testApp = createApp();
  testApp.route('/', router);
  return testApp;
}
