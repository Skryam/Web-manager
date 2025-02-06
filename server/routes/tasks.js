// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      app.authenticate(req, reply);
      const tasks = await app.objection.models.task.query().withGraphFetched('[status, creator]');
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      app.authenticate(req, reply);
      const task = new app.objection.models.task();

      const statuses = await app.objection.models.status.query();
      console.log(statuses)
      const users = await app.objection.models.user.query();
      reply.render('tasks/new', { task, statuses, users });
      return reply;
    });
};
