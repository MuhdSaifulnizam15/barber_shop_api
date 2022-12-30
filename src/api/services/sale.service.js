const httpStatus = require("http-status");
const { Sale } = require("../models");
const ApiError = require("../utils/ApiError");
const { getBranchById } = require("./branch.service");
const { getCustomerById } = require("./customer.service");
const { getStaffById } = require("./staff.service");

const createSale = async (userBody) => {
  const branch = await getBranchById(userBody.branch_id);
  if (!branch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "branch not found.");
  }
  userBody.branch_id = branch._id;

  const barber = await getStaffById(userBody.barber_id);
  if (!barber) {
    throw new ApiError(httpStatus.BAD_REQUEST, "barber not found.");
  }
  userBody.barber_id = barber._id;

  const customer = await getCustomerById(userBody.customer_id);
  if (!customer) {
    throw new ApiError(httpStatus.BAD_REQUEST, "customer not found.");
  }
  userBody.customer_id = customer._id;

  const sale = await Sale.create(userBody);
  return sale;
};

const querySales = async (options) => {
  options.populate = ['branch_id', 'barber_id', 'customer_id', 'services'];
  const sales = await Sale.paginate({}, options);
  return sales;
};

const getSaleById = async (id) => {
  return Sale.findById(id);
};

const updateSaleById = async (saleId, updateBody) => {
  const sale = await getSaleById(saleId);
  if (!sale) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Sale not found");
  }
  Object.assign(sale, updateBody);
  await sale.save();
  return sale;
};

const deleteSaleById = async (saleId) => {
  const sale = await getSaleById(saleId);
  if (!sale) {
    throw new ApiError(httpStatus.NOT_FOUND, "Sale not found");
  }
  await sale.remove();
  return sale;
};

module.exports = {
  createSale,
  querySales,
  getSaleById,
  updateSaleById,
  deleteSaleById,
};
