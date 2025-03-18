// @ts-check
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, getSession, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    cookie = await getSession(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      name: 'testTask',
      description: 'testDescription',
      statusId: 1,
      executorId: 1,
      labels: [
        { id: 1 },
        { id: 2 },
      ],
    };
    const task = await models.task.query().findOne({ name: params.name }).withGraphFetched('labels');
    expect(task).toMatchObject(expected);
  });

  it('filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      query: {
        status: '1',
        executor: '1',
        label: '1',
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('task1');
  });

  it('filterSome', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      query: {
        status: '',
        executor: '',
        label: '2',
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('task2');
  });

  it('edit', async () => {
    const task = await models.task.query().findOne({ name: 'task1' });
    const responseEdit = await app.inject({
      method: 'GET',
      url: `/tasks/${task.id}/edit`,
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(200);
  });

  it('patch', async () => {
    const task = await models.task.query().findOne({ name: 'task2' });
    const paramsPatched = testData.tasks.patched;

    const responsePatch = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: {
        data: paramsPatched,
      },
      cookies: cookie,
    });

    expect(responsePatch.statusCode).toBe(302);

    const expected = {
      name: paramsPatched.name,
      description: paramsPatched.description,
      statusId: 1,
      executorId: null,
      labels: [
        { id: 2 },
      ],
    };

    const patchedStatus = await models.task.query().findOne({ id: task.id }).withGraphFetched('labels');
    expect(patchedStatus).toMatchObject(expected);
  });

  it('delete', async () => {
    // создаем новую
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: {
          name: 'superTask',
          description: '',
          statusId: '1',
          executorId: '',
          labels: '1',
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);

    const task = await models.task.query().findOne({ name: 'superTask' });
    const responseDelete = await app.inject({
      method: 'DELETE',
      url: `/tasks/${task.id}`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    expect(await models.task.query().findOne({ id: task.id })).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
