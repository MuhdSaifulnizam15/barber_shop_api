const Joi = require("joi");

const createSatff = {
  body: Joi.object().keys({
    full_name: Joi.string().required(),
    phone_no: Joi.string().required(),
    branch_id: Joi.string().required(),
  }),
};

const updateSatff = {
  params: Joi.object().keys({
    staffId: Joi.string().required(),
  }),
};

const deleteSatff = {
  params: Joi.object().keys({
    staffId: Joi.string().required(),
  }),
};

module.exports = {
  createSatff,
  updateSatff,
  deleteSatff,
};
