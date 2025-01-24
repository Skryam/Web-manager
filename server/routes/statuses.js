// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, (req, reply) => {
      app.authenticate(req, reply);
      return reply.render('statuses/index');
    });
};
