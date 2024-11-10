import { insertTasksSchema, selectTasksSchema, updateTaskSchema } from '@/db/schema';
import { notFoundSchema } from '@/lib/constants';
import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentOneOf, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, createMessageObjectSchema, IdParamsSchema } from 'stoker/openapi/schemas';

const tags = ['Tasks'];
// Route definition.
export const list = createRoute({
  tags,
  path: '/tasks',
  method: 'get',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      'The lists of tasks',
    ),
  },
});

export const create = createRoute({
  path: '/task',
  method: 'post',
  request: {
    // validate the incoming body.
    body: jsonContentRequired(insertTasksSchema, 'The Tasks to create'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      'The created task',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      'The validation errors',
    ),
  },
});

export const getTaskById = createRoute({
  path: '/task/{id}',
  method: 'get',
  request: {
    params: IdParamsSchema, // validate the Params.
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTasksSchema, 'Specific Task'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid Id Error',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Task Not Found',
    ),
  },
});

export const updateTaskById = createRoute({
  path: '/task/{id}',
  method: 'patch',
  request: {
    // validate the ID and the fields being updated.
    params: IdParamsSchema,
    body: jsonContentRequired(updateTaskSchema, 'The Task being updated'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTasksSchema, 'The updated Task'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Task Not Found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(updateTaskSchema),
        createErrorSchema(IdParamsSchema),
      ],
      'Invalid ID Param or Invalid Body',
    ),
    // [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertTasksSchema).or(createErrorSchema(IdParamsSchema)), 'Invalid ID'),
  },
});

export const deleteTaskById = createRoute({
  path: '/task/{id}',
  method: 'delete',
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema(`Done`), `Task Deleted`),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), `Invalid ID`),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, `Not found`),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type TaskById = typeof getTaskById;
export type patchTaskById = typeof updateTaskById;
export type removeTaskById = typeof deleteTaskById;
