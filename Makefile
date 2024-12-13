setup: prepare install db-migrate

install:
	npm install

db-migrate:
	npx knex migrate:latest

build:
	npm run build

prepare:
	cp -n .env.example .env || true

start:
	start-frontend
	start-backend

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack

lint:
	npx eslint .

test:
	npm test -s
