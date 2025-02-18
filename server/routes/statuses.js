// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      app.authenticate(req, reply);
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus' }, (req, reply) => {
      app.authenticate(req, reply);
      const status = new app.objection.models.status();
      return reply.render('statuses/new', { status });
    })
    .post('/statuses', async (req, reply) => {
      app.authenticate(req, reply);
      const status = new app.objection.models.status();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (errors) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors });
      }

      return reply;
    })
    .get('/statuses/:id/edit', async (req, reply) => {
      app.authenticate(req, reply);
      const status = await app.objection.models.status.query().findById(req.params.id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .patch('/statuses/:id', async (req, reply) => {
      app.authenticate(req, reply);
      const status = await app.objection.models.status.query().findById(req.params.id);

      try {
        await status.$query().patch({ name: req.body.data.name });
        req.flash('info', i18next.t('flash.statuses.patch.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (errors) {
        req.flash('error', i18next.t('flash.statuses.patch.error'));
        reply.render('statuses/edit', { status, errors: errors.data });
      }

      return reply;
    })
    .delete('/statuses/:id', async (req, reply) => {
      app.authenticate(req, reply);
      const { id } = req.params;
      const checkTask = await app.objection.models.task.query().where({ status_id: id });
      if (checkTask.length > 0) {
        req.flash('error', 'est svyaz');
        reply.redirect('/statuses');
      } else {
        await app.objection.models.status.query().deleteById(id);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect('/statuses');
      }
      return reply;
    });
};
