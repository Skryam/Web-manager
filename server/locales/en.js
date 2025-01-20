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
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        lang: 'RU',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
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
    },
  },
};
