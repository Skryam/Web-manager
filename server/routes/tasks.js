// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      app.authenticate(req, reply);
      console.log('PROOOOSHLOOOO')
      const tasks = await app.objection.models.task.query().withGraphFetched('[status, creator, executor]');
      console.log('taaaaaaaaask', tasks)
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
      const { data } = req.body;

      const taskData = {
        ...data,
        creatorId: req.user.id,
        statusId: parseInt(data.statusId, 10) || 0,
        executorId: parseInt(data.executorId, 10) || null,
      };

      try {
        const validTask = await app.objection.models.task.fromJson(taskData);
        await app.objection.models.task.query().insert(validTask);
        req.flash('info', 'norm');
        reply.redirect(app.reverse('tasks'));
      } catch (errors) {
        console.log('####################', errors.data);
        const task = new app.objection.models.task();
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();

        req.flash('error', 'upal');
        reply.render('tasks/new', {
          task, statuses, users, errors: errors.data,
        });
      }

      return reply;
    })
    .get('/tasks/:id', async (req, reply) => {
      app.authenticate(req, reply);
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor]');
      console.log(task);
      reply.render('tasks/view', { task });
      return reply;
    })
    .get('/tasks/:id/edit', async (req, reply) => {
      app.authenticate(req, reply);
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor]');
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      console.log(task);
      reply.render('tasks/edit', { task, statuses, users });
      return reply;
    })
    .patch('/tasks/:id', async (req, reply) => {
      app.authenticate(req, reply);
      const { data } = req.body;
      data.statusId = parseInt(data.statusId, 10) || 0;
      data.executorId = parseInt(data.executorId, 10) || null;

      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor]');

      try {
        await task.$query().patch(data);
        req.flash('info', 'nrom');
        reply.redirect(app.reverse('tasks'));
      } catch (errors) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        req.flash('error', 'upal');
        reply.render('tasks/edit', {
          task, statuses, users, errors: errors.data,
        });
      }

      return reply;
    })
    .delete('/tasks/:id', async (req, reply) => {
      app.authenticate(req, reply);
      await app.objection.models.task.query().deleteById(req.params.id);
      req.flash('info', 'norm');
      return reply.redirect('/tasks');
    });
};
