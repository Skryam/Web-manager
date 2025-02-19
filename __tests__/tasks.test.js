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

    // TODO: пока один раз перед тестами
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
    cookie = await getSession(app);
  });

  beforeEach(async () => {
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
  });

  it('create', async () => {
    const params = testData.tasks;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });
    console.log(response)

    expect(response.statusCode).toBe(302);
    const expected = {
      name: 'testTask',
      description: 'testDescription',
      statusId: 1,
      executorId: 1,
    };
    const task = await models.task.query().findOne({ name: params.name });
    expect(task).toMatchObject(expected);
  });

  /* it('patch / delete', async () => {
    const status = await models.status.query().findOne({ name: testData.statuses.new.name });
    const paramsPatched = testData.statuses.patched;

    const responseEdit = await app.inject({
      method: 'GET',
      url: `/statuses/${status.id}/edit`,
      // используем полученные ранее куки
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const responsePatch = await app.inject({
      method: 'PATCH',
      url: `/statuses/${status.id}`,
      payload: {
        data: paramsPatched,
      },
      cookies: cookie,
    });

    expect(responsePatch.statusCode).toBe(302);

    const expected = {
      name: paramsPatched.name,
    };
    const patchedStatus = await models.status.query().findOne({ id: status.id });
    expect(patchedStatus).toMatchObject(expected);

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: `/statuses/${status.id}`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    expect(await models.status.query().findOne({ id: status.id })).toBeUndefined();
  }); */

  afterEach(async () => {
    // Пока Segmentation fault: 11
    // после каждого теста откатываем миграции
    // await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
