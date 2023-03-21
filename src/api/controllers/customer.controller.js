const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { customerService } = require('../services');

const createCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(httpStatus.CREATED).send({ status: true, code: '0000', customer });
});

const getCustomers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['phone_no', 'name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  let sort = '';
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push((order === 'desc' ? '-' : '') + key);
    });
    sort = sortingCriteria.join(' ');
  } else {
    sort = 'createdAt';
  }

  options.sort = sort;

  const result = await customerService.queryCustomers(filter, options);
  res.send({ status: true, code: '0000', result });
});

const getCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  res.send({ status: true, code: '0000', customer });
});

const getCustomerByPhoneNum = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerByPhoneNum(
    req.params.phoneNo
  );
  console.log('customer', customer);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer phone no not found');
  }
  res.send({ status: true, code: '0000', customer });
});

const updateCustomer = catchAsync(async (req, res) => {
  const customer = await customerService.updateCustomerById(
    req.params.customerId,
    req.body
  );
  res.send({ status: true, code: '0000', customer });
});

const deleteCustomer = catchAsync(async (req, res) => {
  await customerService.deleteCustomerById(req.params.customerId);
  res.send({
    status: true,
    code: '0000',
    message: 'Customer successfully deleted',
  });
});

module.exports = {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerByPhoneNum,
};
