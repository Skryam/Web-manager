// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      app.authenticate(req, reply);
      const tasks = await app.objection.models.tasks.query();
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, (req, reply) => {
      const task = new app.objection.models.task();
      return reply.render('statuses/new', { task });
    });
};
