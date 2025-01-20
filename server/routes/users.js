// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const currentUser = req.user;
      console.log(currentUser);
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users, currentUser });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.redirect('users/new', { user, errors: data });
      }

      return reply;
    })
    .get('/users/:id/edit', { name: 'editUser' }, (req, reply) => {
      if (!req.user || req.user.id !== Number(req.params.id)) {
        req.flash('error', i18next.t('flash.authError'));
        return reply.redirect(app.reverse('root'));
      }
      return reply.render('users/edit', { data: req.user });
    })
    .patch('/users/:id', { name: 'patchUser' }, async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().findById(req.user.id).patch(validUser);
        req.flash('info', i18next.t('flash.users.patch.success'));
        reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.patch.error'));
        reply.redirect(`users/${req.user.id}/edit`, { user, errors: data });
      }

      return reply;
    })
    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      if (!req.user || req.user.id !== Number(req.params.id)) {
        req.flash('error', i18next.t('flash.authError'));
        return reply.redirect(app.reverse('root'));
      }
      req.logOut();
      await app.objection.models.user.query().deleteById(req.params.id);
      req.flash('info', i18next.t('flash.users.delete.success'));
      return reply.redirect('/users');
    });
};
