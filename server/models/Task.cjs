// @ts-check

const objectionUnique = require('objection-unique');
const BaseModel = require('./BaseModel.cjs');
const Status = require('./Status.cjs');
const User = require('./User.cjs');
const Label = require('./Label.cjs');

const unique = objectionUnique({ fields: ['id'] });

module.exports = class Task extends unique(BaseModel) {
  static get tableName() {
    return 'tasks';
  }

  $parseJson(json) {
    const taskData = {
      ...json,
      statusId: Number(json.statusId),
      executorId: parseInt(json.executorId, 10) || null,
    };
    return super.$parseJson(taskData);
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string' },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer' },
        executorId: { type: ['integer', 'null'] },
      },
    };
  }

  static get modifiers() {
    return {
      filter(builder, column, query) {
        builder.where(column, query);
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Status,
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            from: 'tasksLabels.taskId',
            to: 'tasksLabels.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }
};
