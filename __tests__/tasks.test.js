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
      labels: expect.arrayContaining([
        expect.objectContaining({ id: 1 }),
        expect.objectContaining({ id: 2 }),
      ]),
    };
    const task = await models.task.query().findOne({ name: params.name }).withGraphFetched('labels');
    expect(task).toMatchObject(expected);
  });

  it('filter', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      query: {
        status: 'testStatus',
        executor: 'elbert_abshire52@gmail.com',
        label: 'label1',
        isCreatorUser: 'on',
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('elbert_abshire52@gmail.com');
  });

  it('filterSome', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      query: {
        status: '',
        executor: 'elbert_abshire52@gmail.com',
        label: '',
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('elbert_abshire52@gmail.com');
  })

  it('patch / delete', async () => {
    const task = await models.task.query().findOne({ name: testData.tasks.new.name });
    const paramsPatched = testData.tasks.patched;

    const responseEdit = await app.inject({
      method: 'GET',
      url: `/tasks/${task.id}/edit`,
      // используем полученные ранее куки
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(200);

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
    };

    const patchedStatus = await models.task.query().findOne({ id: task.id }).withGraphFetched('labels');
    expect(patchedStatus).toMatchObject(expected);

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: `/tasks/${task.id}`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    expect(await models.task.query().findOne({ id: task.id })).toBeUndefined();
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
