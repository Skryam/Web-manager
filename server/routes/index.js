// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import changeLang from './changeLang.js';

const controllers = [
  welcome,
  users,
  session,
  changeLang,
];

export default (app) => controllers.forEach((f) => f(app));
