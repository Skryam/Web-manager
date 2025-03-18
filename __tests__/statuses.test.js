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
      url: app.reverse('statuses'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
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

  it('edit', async () => {
    const status = await models.status.query().findOne({ name: 'Status1' });
    const responseEdit = await app.inject({
      method: 'GET',
      url: `/statuses/${status.id}/edit`,
      cookies: cookie,
    });
    expect(responseEdit.statusCode).toBe(200);
  });

  it('patch', async () => {
    const status = await models.status.query().findOne({ name: 'Status1' });
    const paramsPatched = testData.statuses.patched;

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
  });

  it('delete', async () => {
    const status = await models.status.query().findOne({ name: 'Status2' });
    const responseDelete = await app.inject({
      method: 'DELETE',
      url: `/statuses/${status.id}`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    expect(await models.status.query().findOne({ id: status.id })).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
