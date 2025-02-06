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
      const users = await app.objection.models.user.query();
      reply.render('tasks/new', { task, statuses, users });
      return reply;
    })
    .post('/tasks', async (req, reply) => {
      app.authenticate(req, reply);
      const task = new app.objection.models.task();
      const creator = {creatorId: req.user.id};
      task.$set(req.body.data);
      task.$set(creator);
      console.log('!!!!!!!!!!!!!!', task, req.user.id)

      try {
        const validTask = await app.objection.models.task.fromJson(req.body.data);
        await app.objection.models.task.query().insert(validTask);
        req.flash('info', 'norm');
        reply.redirect(app.reverse('tasks'));
      } catch (errors) {
        console.log('################################', errors)
        req.flash('error', 'upal');
        reply.render('tasks/new', { task, errors });
      }

      return reply;
    });
};
