const httpStatus = require('http-status');
const moment = require('moment');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { saleService, staffService } = require('../services');

const createSale = catchAsync(async (req, res) => {
  const sale = await saleService.createSale(req.body);
  res.status(httpStatus.CREATED).send({ status: true, code: '0000', sale });
});

const getSales = catchAsync(async (req, res) => {
  const params = pick(req.query, ['userId']);
  if (params?.userId) {
    const staff = await staffService.getStaffByUserId(params.userId);
    console.log(staff);
    req.query.barber_id = staff._id.toString();
  }

  const filter = pick(req.query, ['barber_id', 'branch_id', 'customer_id']);

  if (req?.query?.start_date) {
    filter.createdAt = {
      $gte: moment(req?.query?.start_date).startOf('day').format(),
      $lte: req?.query?.end_date
        ? moment(req?.query?.end_date).endOf('day').format()
        : moment().endOf('day').format(),
    };
  }

  console.log('moment', filter);

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

  const result = await saleService.querySales(filter, options);
  res.send({ status: true, code: '0000', result });
});

const getSale = catchAsync(async (req, res) => {
  const sale = await saleService.getServiceById(req.params.saleId);
  if (!sale) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sale not found');
  }
  res.send({ status: true, code: '0000', sale });
});

const updateSale = catchAsync(async (req, res) => {
  const sale = await saleService.updateServiceById(req.params.saleId, req.body);
  res.send({ status: true, code: '0000', sale });
});

const deleteSale = catchAsync(async (req, res) => {
  await saleService.deleteSaleById(req.params.saleId);
  res.send({
    status: true,
    code: '0000',
    message: 'Sale successfully deleted',
  });
});

const getTotalSales = catchAsync(async (req, res) => {
  const data = await saleService.getTotalSales();
  res.send({ status: true, code: '0000', sales_data: data });
});

const getChartData = catchAsync(async (req, res) => {
  const data = await saleService.getChartData(req.params.chartType);
  res.send({ status: true, code: '0000', chart: data });
});

module.exports = {
  createSale,
  getSale,
  getSales,
  updateSale,
  deleteSale,
  getTotalSales,
  getChartData,
};
