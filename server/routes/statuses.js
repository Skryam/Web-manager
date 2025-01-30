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
      reply.render('statuses/new', { status });
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
      reply.render('statuses/edit', { data: status });
      return reply;
    })
    .patch('/statuses/:id', async (req, reply) => {
      app.authenticate(req, reply);
      const newData = req.body.data;

      try {
        const status = await app.objection.models.user.query().findById(req.params.id);
        await status.$query().patch({ name: newData.name });
        req.flash('info', i18next.t('flash.statuses.patch.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (err) {
        req.flash('error', i18next.t('flash.statuses.patch.error'));
        reply.render('statuses/edit', { status: newData, errors: err });
      }

      return reply;
    })
};
