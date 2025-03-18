// @ts-check
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, getSession, prepareData } from './helpers/index.js';

describe('test labels CRUD', () => {
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
    // TODO: пока один раз перед тестами
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
    cookie = await getSession(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.labels.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      name: 'superLabel',
    };
    const label = await models.label.query().findOne({ name: params.name });
    expect(label).toMatchObject(expected);
  });

  it('edit', async () => {
    const label = await models.label.query().findOne({ name: 'label1' });
    const responseEdit = await app.inject({
      method: 'GET',
      url: `/labels/${label.id}/edit`,
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(200);
  });

  it('patch', async () => {
    const label = await models.label.query().findOne({ name: 'label1' });
    const paramsPatched = testData.labels.patched;

    const responsePatch = await app.inject({
      method: 'PATCH',
      url: `/labels/${label.id}`,
      payload: {
        data: paramsPatched,
      },
      cookies: cookie,
    });

    expect(responsePatch.statusCode).toBe(302);

    const expected = {
      name: paramsPatched.name,
    };
    const patchedLabel = await models.label.query().findOne({ id: label.id });
    expect(patchedLabel).toMatchObject(expected);
  });

  it('delete', async () => {
    const label = await models.label.query().findOne({ name: 'label3' });
    const responseDelete = await app.inject({
      method: 'DELETE',
      url: `/labels/${label.id}`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    expect(await models.label.query().findOne({ id: label.id })).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
