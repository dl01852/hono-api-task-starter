import index from '@/routes/index.route';
import tasks from '@/routes/tasks/tasks.index';
import createApp from './lib/create-app';
import configureOpenApi from './lib/openApi';

const app = createApp();

configureOpenApi(app);

const _app = app
  .route('/', index)
  .route('/', tasks);

export type AppType = typeof _app;

export default app;
