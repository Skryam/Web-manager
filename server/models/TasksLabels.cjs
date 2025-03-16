// @ts-check

const objectionUnique = require('objection-unique');
const BaseModel = require('./BaseModel.cjs');

const unique = objectionUnique({ fields: [['taskId', 'labelId']] });

module.exports = class tasksLabels extends unique(BaseModel) {
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
