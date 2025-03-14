// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');

    table.integer('status_id').notNullable();
    table.foreign('status_id').references('id').inTable('statuses');

    table.integer('executor_id').nullable();
    table.foreign('executor_id').references('id').inTable('users');

    table.integer('creator_id').notNullable();
    table.foreign('creator_id').references('id').inTable('users');

    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex) => knex.schema.dropTable('tasks');
