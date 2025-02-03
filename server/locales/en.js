// @ts-check

export default {
  translation: {
    appName: 'Fastify Boilerplate',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        delete: {
          success: 'User deleted successfully',
        },
        patch: {
          success: 'User successfully changed',
          error: 'Failed to change user',
        },
      },
      statuses: {
        create: {
          success: 'Status created successfully',
          error: 'Failed to create status',
        },
        patch: {
          success: 'Status successfully changed',
          error: 'Failed to change status',
        },
        delete: {
          success: 'Status deleted successfully',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        lang: 'RU',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
        statuses: 'Statuses',
      },
    },
    views: {
      session: {
        new: {
          email: 'email',
          password: 'password',
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Created at',
        actions: 'Actions',
        editbtn: 'Edit',
        delete: 'Delete',
        new: {
          email: 'email',
          password: 'password',
          submit: 'Register',
          signUp: 'Register',
        },
        edit: {
          cardName: 'Edit User',
          name: 'Name',
          lastName: 'Last Name',
          email: 'Email',
          password: 'Password',
          change: 'Change',
        },
      },
      welcome: {
        index: {
          hello: 'Web Manager',
          description: 'Online web manager',
          more: 'Learn more',
        },
      },
      statuses: {
        status: 'Statuses',
        create: 'Create status',
        name: 'Name',
        creationDate: 'Creation date',
        editbtn: 'Change',
        delete: 'Delete',
        new: {
          create: 'Status creation',
          name: 'Name',
          createButton: 'Create',
        },
        edit: {
          change: 'Status change',
          changeButton: 'Change',
        },
      },
    },
  },
};
