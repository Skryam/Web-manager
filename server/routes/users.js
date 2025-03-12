// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const currentUser = req.user;
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users, currentUser });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      return reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const { data } = req.body;
      try {
        const validUser = await app.objection.models.user.fromJson(data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (errors) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: data, errors: errors.data });
      }

      return reply;
    })
    .get('/users/:id/edit', { name: 'editUser' }, (req, reply) => {
      app.authenticate(req, reply);
      return reply.render('users/edit', { data: req.user });
    })
    .patch('/users/:id', { name: 'patchUser' }, async (req, reply) => {
      app.authenticate(req, reply);
      const newData = req.body.data;

      try {
        const person = await app.objection.models.user.query().findById(req.user.id);
        await person.$query().patch({ email: newData.email, password: newData.password });
        req.flash('info', i18next.t('flash.users.patch.success'));
        reply.redirect(app.reverse('users'));
      } catch (err) {
        req.flash('error', i18next.t('flash.users.patch.error'));
        reply.render('users/edit', { data: req.user, errors: err.data });
      }

      return reply;
    })
    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      app.authenticate(req, reply);
      const { id } = req.params;
      const checkTask = await app.objection.models.task.query().where({ executor_id: id })
        .orWhere({ creator_id: id });
      if (checkTask.length > 0) {
        req.flash('error', 'est svyaz');
        reply.redirect('/users');
      } else if (parseInt(req.user.id, 10) !== parseInt(id, 10)) {
        req.flash('error', 'ne sozdal');
        reply.redirect('/users');
      } else {
        req.logOut();
        await app.objection.models.user.query().deleteById(id);
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect('/users');
      }
      return reply;
    });
};
