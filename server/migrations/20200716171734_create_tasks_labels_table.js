// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tasks_labels', (table) => {
    table.increments('id').primary();

    table.integer('task_id').notNullable();
    table.foreign('task_id').references('id').inTable('tasks');

    table.integer('label_id').notNullable();
    table.foreign('label_id').references('id').inTable('labels');

    table.unique(['task_id', 'label_id']);
  })
);

export const down = (knex) => knex.schema.dropTable('tasks_labels');