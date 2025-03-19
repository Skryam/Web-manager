// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const { query } = req;

      const filter = {
        status: query.status || undefined,
        executor: query.executor || undefined,
        label: query.label || undefined,
        userId: query.isCreatorUser ? req.user.id : undefined,
      };

      const tasks = await app.objection.models.task.query().withGraphJoined('[status, creator, executor, labels]')
        .skipUndefined()
        .modify('filter', 'statusId', filter.status)
        .modify('filter', 'executorId', filter.executor)
        .modify('filter', 'labels.id', filter.label)
        .modify('filter', 'creatorId', filter.userId);

      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/index', {
        tasks, statuses, users, labels, filter,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      const data = { creatorId: req.user.id, ...req.body.data };
      const labelsForInsert = await app.objection.models.label.query().findByIds(data.labels || []);

      try {
        await app.objection.models.task.transaction(async (trx) => {
          const validTask = await app.objection.models.task.fromJson(data);

          return app.objection.models.task.query(trx).insertGraph(
            [{
              ...validTask,
              labels: labelsForInsert,
            }],
            {
              relate: true,
            },
          );
        });

        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (errors) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task: data, statuses, users, labels, errors: errors.data,
        });
      }

      return reply;
    })
    .get('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor, labels]');
      reply.render('tasks/view', { task });
      return reply;
    })
    .get('/tasks/:id/edit', { preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor, labels]');
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .patch('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor, labels]');
      const parse = await app.objection.models.task
        .fromJson(req.body.data, { skipValidation: true });

      try {
        await app.objection.models.task.transaction(async (trx) => {
          const updateLabels = await app.objection.models.label
            .query(trx)
            .select('id')
            .findByIds(parse.labels || []);

          return app.objection.models.task.query(trx).upsertGraph(
            {
              ...parse,
              id: task.id,
              creatorId: task.creatorId,
              labels: updateLabels,
            },
            {
              relate: true,
              unrelate: true,
              noUpdate: ['labels'],
              noInsert: ['labels'],
              noDelete: ['labels'],
            },
          );
        });

        req.flash('info', i18next.t('flash.tasks.patch.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (errors) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const dbLabels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.tasks.patch.error'));
        reply.render('tasks/edit', {
          task, statuses, users, labels: dbLabels, errors: errors.data,
        });
      }

      return reply;
    })
    .delete('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
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
