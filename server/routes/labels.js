// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      app.authenticate(req, reply);
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel' }, (req, reply) => {
      app.authenticate(req, reply);
      const label = new app.objection.models.label();
      return reply.render('labels/new', { label });
    })
    .post('/labels', async (req, reply) => {
      app.authenticate(req, reply);
      const { data } = req.body;
      const label = new app.objection.models.label();
      label.$set(data);

      try {
        const validLabel = await app.objection.models.label.fromJson(data);
        await app.objection.models.label.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch (errors) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors });
      }

      return reply;
    })
    .get('/labels/:id/edit', async (req, reply) => {
      app.authenticate(req, reply);
      const label = await app.objection.models.label.query().findById(req.params.id);
      reply.render('statuses/edit', { label });
      return reply;
    })
    /*
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
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.redirect('/statuses');
      } else {
        await app.objection.models.status.query().deleteById(id);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect('/statuses');
      }
      return reply;
    });
    */
};
