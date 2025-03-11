import i18next from 'i18next';

export default (app) => {
  app
    .post('/change-language', { name: 'changeLang' }, (req, reply) => {
      console.log('!!!!!!!!!!!!!', req.headers.referer)
      const lng = i18next.language === 'en' ? 'ru' : 'en';
      i18next.changeLanguage(lng);
      reply.redirect(req.headers.referer);
    });
};
