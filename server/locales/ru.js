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
      statuses: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        patch: {
          success: 'Статус успешно изменён',
          error: 'Не удалось изменить статус',
        },
        delete: {
          success: 'Статус успешно удален',
          error: 'Связан с задачей',
        },
      },
      tasks: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        patch: {
          success: 'Задача успешно изменена',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
          error: 'Вы не автор задачи',
        },
      },
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        patch: {
          success: 'Метка успешно изменена',
          error: 'Не удалось изменить метку',
        },
        delete: {
          success: 'Метка успешно удалена',
          error: 'Связана с задачей',
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
        tasks: 'Задачи',
        labels: 'Метки',
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
      statuses: {
        status: 'Статусы',
        create: 'Создать статус',
        name: 'Наименование',
        creationDate: 'Дата создания',
        editbtn: 'Изменить',
        delete: 'Удалить',
        new: {
          create: 'Создание статуса',
          name: 'Наименование',
          createButton: 'Создать',
        },
        edit: {
          change: 'Изменение статуса',
          changeButton: 'Изменить',
        },
      },
      tasks: {
        title: 'Задачи',
        create: 'Создать задачу',
        name: 'Название',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        createdAt: 'Дата создания',
        editbtn: 'Редактировать',
        delete: 'Удалить',
        new: {
          title: 'Создание задачи',
          name: 'Название',
          description: 'Описание',
          status: 'Статус',
          executor: 'Исполнитель',
          submit: 'Сохранить',
        },
        view: {
          creator: 'Автор',
          executor: 'Исполнитель',
          date: 'Дата создания',
          edit: 'Редактировать',
          delete: 'Удалить',
        },
        edit: {
          title: 'Редактирование задачи',
          name: 'Название',
          description: 'Описание',
          status: 'Статус',
          executor: 'Исполнитель',
          submit: 'Сохранить',
        },
      },
      labels: {
        status: 'Метки',
        create: 'Создать метку',
        name: 'Наименование',
        creationDate: 'Дата создания',
        editbtn: 'Изменить',
        delete: 'Удалить',
        new: {
          create: 'Создание метки',
          name: 'Наименование',
          createButton: 'Создать',
        },
        edit: {
          change: 'Изменение метки',
          changeButton: 'Изменить',
        },
      },
    },
  },
};
