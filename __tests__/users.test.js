// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData, getSession } from './helpers/index.js';

describe('test users CRUD', () => {
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
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('edit', async () => {
    const user = await models.user.query().findOne({ email: 'test@test.com' });
    const responseEdit = await app.inject({
      method: 'GET',
      url: `/users/${user.id}/edit`,
      // используем полученные ранее куки
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(200);
  });

  it('patch', async () => {
    const user = await models.user.query().findOne({ email: 'test@test.com' });
    const paramsPatched = testData.users.patched;

    const responsePatch = await app.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      payload: {
        data: paramsPatched,
      },
      cookies: cookie,
    });

    expect(responsePatch.statusCode).toBe(302);

    const expected = {
      ..._.omit(paramsPatched, 'password'),
      passwordDigest: encrypt(paramsPatched.password),
    };
    const patchedUser = await models.user.query().findOne({ id: user.id });
    expect(patchedUser).toMatchObject(expected);
  });

  it('delete', async () => {
    const user = await models.user.query().findOne({ email: 'test@test.com' });
    const responseDelete = await app.inject({
      method: 'DELETE',
      url: `/users/${user.id}`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    expect(await models.user.query().findOne({ id: user.id })).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
