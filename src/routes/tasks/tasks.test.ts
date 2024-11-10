/* eslint-disable ts/ban-ts-comment */
import createApp, { createTestApp } from '@/lib/create-app';
import { testClient } from 'hono/testing';
import { describe, expect, expectTypeOf, it } from 'vitest';
import router from './tasks.index';

const taskApp = createApp().route('/', router);
const taskClient = testClient(taskApp);

describe('tasks list', () => {
  it('responds with an array', async () => {
    const testRouter = createTestApp(router);
    const response = await testRouter.request('/tasks');
    const result = await response.json();
    console.log(result);
    // @ts-expect-error
    expectTypeOf(result).toBeArray();
  });

  it('responds with an array again', async () => {
    const response = await taskClient.tasks.$get();
    const json = await response.json();
    expectTypeOf(json).toBeArray();
  });

  it('validates the ID param', async () => {
    const response = await taskClient.task[':id'].$get({ param: { id: 'derp' } });
    expect(response.status).toBe(422);
  });

  it ('validates t he body when creating', async () => {
    const response = await taskClient.task.$post({
      json: {
        name: `Learning ViTest`,
        done: false,
      },
    });
    expect(response.status).toBe(200);
  });
});
