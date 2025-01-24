// @ts-check

export default {
  translation: {
    appName: 'Fastify Шаблон',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        delete: {
          success: 'Пользователь успешно удален',
        },
        patch: {
          success: 'Пользователь успешно изменён',
          error: 'Не удалось изменить пользователя',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        lang: 'EN',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
      },
    },
    views: {
      session: {
        new: {
          email: 'email',
          password: 'пароль',
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
        editbtn: 'Изменить',
        delete: 'Удалить',
        new: {
          email: 'email',
          password: 'пароль',
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          cardName: 'Изменение пользователя',
          name: 'Имя',
          lastName: 'Фамилия',
          email: 'Email',
          password: 'Пароль',
          change: 'Изменить',
        },
      },
      welcome: {
        index: {
          hello: 'Веб Менеджер',
          description: 'Онлайн веб менеджер',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
