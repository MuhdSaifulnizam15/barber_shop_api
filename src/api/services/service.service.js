const httpStatus = require("http-status");
const { Service } = require("../models");
const ApiError = require("../utils/ApiError");
const { getCategoryById } = require("./category.service");

const createService = async (userBody) => {
  if (await Service.isNameTaken(userBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "service already exist.");
  }
  const category = await getCategoryById(userBody.category_id);
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "category not found.");
  }
  userBody.category_id = category._id;
  const service = await Service.create(userBody);
  return service;
};

const queryServices = async (options) => {
  options.populate = ['category_id'];
  const services = await Service.paginate({}, options);
  return services;
};

const getServiceById = async (id) => {
  return Service.findById(id);
};

const getServiceByName = async (name) => {
  return Service.findOne({ name });
};

const updateServiceById = async (serviceId, updateBody) => {
  const service = await getServiceById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Service not found");
  }
  Object.assign(service, updateBody);
  await service.save();
  return service;
};

const deleteServiceById = async (serviceId) => {
  const service = await getServiceById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  await service.remove();
  return service;
};

module.exports = {
  createService,
  queryServices,
  getServiceById,
  getServiceByName,
  updateServiceById,
  deleteServiceById,
};
