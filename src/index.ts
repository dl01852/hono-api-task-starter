import Bun from 'bun';
import app from './app';
import env from './middlewares/env';

const port = env.PORT || 3000;

const server = Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
