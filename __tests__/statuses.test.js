// @ts-check
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, getSession } from './helpers/index.js';

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
    cookie = await getSession(app);
  });

  beforeEach(async () => {
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
  });

  it('create', async () => {
    const params = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      name: 'superStatus',
    };
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(expected);
  });

  it('patch / delete', async () => {
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
  });

  afterEach(async () => {
    // Пока Segmentation fault: 11
    // после каждого теста откатываем миграции
    // await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
