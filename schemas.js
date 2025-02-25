const Joi = require("joi");

const todayTasksSchema = Joi.object({
  todo: Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    dueDay: Joi.date().optional(),
    description: Joi.string().optional(),
    completed: Joi.boolean().optional(),
  }).required(),
});

const categorySchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  todayTasksSchema,
  categorySchema,
};
