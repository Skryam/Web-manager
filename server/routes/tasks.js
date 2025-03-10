// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      app.authenticate(req, reply);
      const filter = { ...req.query };
      console.log('^^^^^^^^', filter);

      const tasks = await app.objection.models.task.query()
        .modify((builder) => {
          if (filter.status) {
            builder.where('statusId', filter.status);
          }
          if (filter.executor) {
            builder.where('executorId', filter.executor);
          }
          if (filter.label) {
            builder.whereExists(
              app.objection.models.task.relatedQuery('labels')
                .where('labels.id', filter.label),
            );
          }
          if (filter.isCreatorUser) {
            console.log(req.user.id);
            builder.where('creatorId', req.user.id);
          }
        })
        .withGraphFetched('[status, creator, executor, labels]');
      console.log('@@@@@@@@@', tasks);

      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/index', {
        tasks, statuses, users, labels, filter,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      app.authenticate(req, reply);
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .post('/tasks', async (req, reply) => {
      app.authenticate(req, reply);
      console.log('begin');
      const { data } = req.body;

      const taskData = {
        ...data,
        creatorId: req.user.id,
        statusId: parseInt(data.statusId, 10) || 0,
        executorId: parseInt(data.executorId, 10) || null,
      };

      try {
        await app.objection.models.task.transaction(async (trx) => {
          console.log('try');
          console.log(data);
          const validTask = await app.objection.models.task.fromJson(taskData);

          const insertTask = await app.objection.models.task.query(trx).insertAndFetch(validTask);
          console.log('iiiiiiiiid', validTask.$id());

          if (data.labels) {
            await Promise.all(
              [...data.labels].flatMap((label) => insertTask.$relatedQuery('labels', trx).relate(label)),
            );
          }
          return insertTask;
        });

        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (errors) {
        console.log('error', errors);
        const task = new app.objection.models.task();
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task, statuses, users, labels, errors: errors.data,
        });
      }

      return reply;
    })
    .get('/tasks/:id', async (req, reply) => {
      app.authenticate(req, reply);
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor, labels]');
      reply.render('tasks/view', { task });
      return reply;
    })
    .get('/tasks/:id/edit', async (req, reply) => {
      app.authenticate(req, reply);
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor, labels]');
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      console.log('############', task);
      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .patch('/tasks/:id', async (req, reply) => {
      app.authenticate(req, reply);
      const { data } = req.body;
      console.log('paaaaaaaaaaatch', data);
      data.statusId = parseInt(data.statusId, 10) || 0;
      data.executorId = parseInt(data.executorId, 10) || null;

      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor, labels]');

      try {
        await task.$query().patch(data);
        await task.$relatedQuery('labels').unrelate();
        if (data.labels && data.labels.length > 0) {
          [...data.labels].forEach(async (label) => {
            await task.$relatedQuery('labels').relate(label);
          });
        }
        req.flash('info', i18next.t('flash.tasks.patch.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (errors) {
        console.log(errors);
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.tasks.patch.error'));
        reply.render('tasks/edit', {
          task, statuses, users, labels, errors: errors.data,
        });
      }

      return reply;
    })
    .delete('/tasks/:id', async (req, reply) => {
      app.authenticate(req, reply);
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);
      if (task.creatorId !== req.user.id) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect('/tasks');
      } else {
        await task.$relatedQuery('labels').unrelate();
        await task.$query().delete();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect('/tasks');
      }
      return reply;
    });
};
