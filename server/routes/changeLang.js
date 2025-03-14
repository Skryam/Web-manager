import i18next from 'i18next';

export default (app) => {
  app
    .post('/change-language', { name: 'changeLang' }, (req, reply) => {
      const lng = i18next.language === 'en' ? 'ru' : 'en';
      i18next.changeLanguage(lng);
      reply
        // .code(201)
        .redirect(req.headers.referer);
    });
};
