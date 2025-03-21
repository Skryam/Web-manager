# Web manager

[![Node CI](https://github.com/hexlet-boilerplates/fastify-nodejs-application/workflows/Node%20CI/badge.svg)](https://github.com/hexlet-boilerplates/fastify-nodejs-application/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/0350e7f8774e83fe2595/maintainability)](https://codeclimate.com/github/Skryam/WebManagerCourse/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0350e7f8774e83fe2595/test_coverage)](https://codeclimate.com/github/Skryam/WebManagerCourse/test_coverage)

---

Web Manager is a full-featured task management web application built using modern technologies such as Node.js , Knex.js , Objection.js and Webpack . It provides an intuitive interface for managing tasks, statuses, and labels, making it easy to organize and track your work.

---

### Features
* Homepage : A clean and user-friendly dashboard to get an overview of your tasks.
* Authentication : Secure user registration and login functionality to manage access.
* Task Status Management : Create and manage statuses to categorize tasks (e.g., "To Do", "In Progress", "Completed").
* Task Label Management : Add descriptive labels to tasks for better organization and filtering.
* Task Management : Create, update, and delete tasks with ease, associating them with statuses and labels.

---

### Technologies Used
* Node.js : The backend runtime environment for building the server.
* Knex.js : A query builder for managing database migrations and queries.
* Objection.js : An ORM for handling database models and relationships.
* Webpack : A module bundler for compiling and optimizing frontend assets.

---

## Getting Started
### Prerequisites
* Node.js
* npm

---

### Installation
1. Clone the repository:
```bash
git clone https://github.com/Skryam/Web-manager
cd Web-manager
```

2. Run the setup script to install dependencies, prepare the environment, and migrate the database:
```bash
make setup
```

3. Start the application:
```bash
make start
```

---

### Makefile Commands

* `setup`: Prepare the environment, install dependencies, and run database migrations.
* `install`: Install project dependencies using `npm install`.
* `db-migrate`: Apply the latest database migrations using Knex.
* `build`: Build the frontend assets using Webpack.
* `start`: Start both the frontend and backend servers.
* `start-backend`: Starts the Node.js backend server with hot-reloading enabled.
* `start-frontend`: Compiles and serves the frontend assets.
* `lint`: Lint the codebase using ESLint.
* `test`: Run the test suite in silent mode.

---

### Environment Configuration
Before running the application, ensure that the .env file is properly configured. You can copy the example configuration:
```bash
cp .env.example .env
```
Update the **.env** file with your desired settings, such as database connection details or server ports.

---

### Try project example here: https://webmanagercourse.onrender.com