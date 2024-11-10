import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
};

// Create a generic Route Handler that takes any RouteConfig that we define.
// and all the handlers will have the AppBindings flowing through it.
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;

export type AppOpenAPI = OpenAPIHono<AppBindings>;
