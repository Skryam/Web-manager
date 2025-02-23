// @ts-check

const BaseModel = require('./BaseModel.cjs');

module.exports = class tasksLabels extends (BaseModel) {
  static get tableName() {
    return 'tasksLabels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        taskId: { type: 'integer', minLength: 1 },
        labelId: { type: 'integer', minLength: 1 },
      },
    };
  }
};
