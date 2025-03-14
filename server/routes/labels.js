// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply
        // .code(200)
        .render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, (req, reply) => {
      const label = new app.objection.models.label();
      return reply
        // .code(200)
        .render('labels/new', { label });
    })
    .post('/labels', { preValidation: app.authenticateasync }, async (req, reply) => {
      const { data } = req.body;
      const label = new app.objection.models.label();
      label.$set(data);

      try {
        const validLabel = await app.objection.models.label.fromJson(data);
        await app.objection.models.label.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply
          // .code(201)
          .redirect(app.reverse('labels'));
      } catch (errors) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: errors.data });
      }

      return reply;
    })
    .get('/labels/:id/edit', { preValidation: app.authenticateasync }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      reply
        // .code(200)
        .render('labels/edit', { label });
      return reply;
    })
    .patch('/labels/:id', { preValidation: app.authenticateasync }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);

      try {
        await label.$query().patch({ name: req.body.data.name });
        req.flash('info', i18next.t('flash.labels.patch.success'));
        reply
          // .code(200)
          .redirect(app.reverse('labels'));
      } catch (errors) {
        req.flash('error', i18next.t('flash.labels.patch.error'));
        reply.render('labels/edit', { label, errors: errors.data });
      }

      return reply;
    })
    .delete('/labels/:id', { preValidation: app.authenticateasync }, async (req, reply) => {
      const { id } = req.params;
      const checkTask = await app.objection.models.tasksLabels.query().where('labelId', id);

      if (checkTask.length > 0) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect('/labels');
      } else {
        await app.objection.models.label.query().deleteById(id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
        reply
          // .code(200)
          .redirect('/labels');
      }
      return reply;
    });
};
