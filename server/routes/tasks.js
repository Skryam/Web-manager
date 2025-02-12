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
      const { data } = req.body;

      const taskData = {
        ...data,
        creatorId: req.user.id,
        statusId: parseInt(data.statusId, 10) || 0,
        executorId: parseInt(data.executorId, 10) || null,
      };

      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', taskData);

      try {
        const validTask = await app.objection.models.task.fromJson(taskData);
        await app.objection.models.task.query().insert(validTask);
        req.flash('info', 'norm');
        reply.redirect(app.reverse('tasks'));
      } catch (errors) {
        console.log('####################', errors);
        const task = new app.objection.models.task();
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        req.flash('error', 'upal');
        reply.render('tasks/new', {
          task, statuses, users, errors: errors.data,
        });
      }

      return reply;
    });
};
