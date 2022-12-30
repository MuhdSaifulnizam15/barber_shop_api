const Joi = require("joi");

const createStaff = {
  body: Joi.object().keys({
    full_name: Joi.string().required(),
    phone_no: Joi.string().required(),
    branch_id: Joi.string().required(),
  }),
};

const updateStaff = {
  params: Joi.object().keys({
    staffId: Joi.string().required(),
  }),
};

const deleteStaff = {
  params: Joi.object().keys({
    staffId: Joi.string().required(),
  }),
};

module.exports = {
  createStaff,
  updateStaff,
  deleteStaff,
};
