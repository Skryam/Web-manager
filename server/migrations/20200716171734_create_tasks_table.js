// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('description');
    table.string('statusId');
    table.string('creatorId');
    table.string('executorId');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex) => knex.schema.dropTable('tasks');
