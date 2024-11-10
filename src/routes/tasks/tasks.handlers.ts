import db from '@/db';
import { tasks } from '@/db/schema';
import type { AppRouteHandler } from '@/lib/types';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import type { CreateRoute, ListRoute, patchTaskById, removeTaskById, TaskById } from './tasks.routes';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const tasks = await db.query.tasks.findMany();
  return context.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  // it'll never make it here if it isn't valid json.
  const task = context.req.valid('json');
  const [inserted] = await db.insert(tasks).values(task).returning();
  return context.json(inserted, HttpStatusCodes.OK);
};

export const getTaskById: AppRouteHandler<TaskById> = async (context) => {
  const { id } = context.req.valid('param');
  const task = await db.query.tasks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });
  if (!task) {
    return context.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }
  //  this will return an array of tasks(it will just be an array of 1 value since we're looking byid)
  // const task1 = await db.select().from(tasks).where(eq(tasks.id, id));
  // context.var.logger.info(`Task1: ${JSON.stringify(task1)}`);
  // context.var.logger.info(`Task: ${JSON.stringify(task)}`);
  return context.json(task, HttpStatusCodes.OK);
};

export const updateTaskById: AppRouteHandler<patchTaskById> = async (context) => {
  const { id } = context.req.valid('param');
  const updateTask = context.req.valid('json');
  // will return a list.. so destructure the first one.
  const [task] = await db.update(tasks)
    .set(updateTask)
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    return context.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }
  return context.json(task, HttpStatusCodes.OK);
};

export const deleteTaskById: AppRouteHandler<removeTaskById> = async (context) => {
  const { id } = context.req.valid('param');
  const deletedTask = await db.delete(tasks).where(eq(tasks.id, id));
  context.var.logger.info(deletedTask);
  if (deletedTask.rowsAffected === 0) {
    return context.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }
  return context.json({ message: `Task Deleted` }, HttpStatusCodes.OK);
};
