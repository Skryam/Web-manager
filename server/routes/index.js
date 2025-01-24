// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import changeLang from './changeLang.js';
import statuses from './statuses.js';

const controllers = [
  welcome,
  users,
  session,
  changeLang,
  statuses,
];

export default (app) => controllers.forEach((f) => f(app));
