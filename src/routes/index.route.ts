import { createRouter } from '@/lib/create-app';
import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

const router = createRouter()
  .openapi(
    createRoute({
      tags: ['Index'],
      method: 'get',
      path: '/',
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema('Example Message'),
          'Tasks API Index',
        ),
      }, // end responses.
    }),
    // 2nd Argument to open API is the handler.
    (c) => {
      return c.json({
        message: 'Tasks API Index',
      }, HttpStatusCodes.OK);
    },
  );

export default router;
