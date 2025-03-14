// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
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
          errRelated: 'Пользователь связан с активной задачей и не может быть удален',
          errNotUser: 'У вас нет разрешения на удаление этого пользователя',
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
          error: 'Статус связан с действующей задачей, удаление невозможно',
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
          error: 'Метка связана с действующей задачей, удаление невозможно',
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
          email: 'Email',
          password: 'Пароль',
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        title: 'Пользователи',
        id: 'ID',
        fullName: 'Полное имя',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
        editbtn: 'Изменить',
        delete: 'Удалить',
        new: {
          fname: 'Имя',
          lname: 'Фамилия',
          email: 'Email',
          password: 'Пароль',
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
        userTasksFilter: 'Мои задачи',
        show: 'Показать',
        new: {
          title: 'Создание задачи',
          name: 'Название',
          description: 'Описание',
          status: 'Статус',
          executor: 'Исполнитель',
          submit: 'Сохранить',
          labels: 'Метки',
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
          labels: 'Метки',
        },
      },
      labels: {
        title: 'Метки',
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
