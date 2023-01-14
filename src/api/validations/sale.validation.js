const Joi = require("joi");

const createSales = {
  body: Joi.object().keys({
    branch_id: Joi.string().required(),
    barber_id: Joi.string().required(),
    order: Joi.array().items(
      Joi.object({
        service: Joi.string().required(),
        quantity: Joi.string(),
      })
    ),
    customer_id: Joi.string().required(),
  }),
};

const updateSales = {
  params: Joi.object().keys({
    saleId: Joi.string().required(),
  }),
};

const deleteSales = {
  params: Joi.object().keys({
    saleId: Joi.string().required(),
  }),
};

const getChartData = {
  params: Joi.object().keys({
    chartType: Joi.string()
      .valid("daily", "past3", "week", "month", "annual")
      .required(),
  }),
};

module.exports = {
  createSales,
  updateSales,
  deleteSales,
  getChartData,
};