import { createRouter } from '@/lib/create-app';
import * as handlers from './tasks.handlers';
import * as routeDef from './tasks.routes';

const router = createRouter()
  .openapi(routeDef.list, handlers.list)
  .openapi(routeDef.create, handlers.create)
  .openapi(routeDef.getTaskById, handlers.getTaskById)
  .openapi(routeDef.updateTaskById, handlers.updateTaskById)
  .openapi(routeDef.deleteTaskById, handlers.deleteTaskById);

export default router;
