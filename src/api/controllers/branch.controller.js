const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { branchService } = require('../services');

const createBranch = catchAsync(async (req, res) => {
  const branch = await branchService.createBranch(req.body);
  res.status(httpStatus.CREATED).send({ status: true, code: '0000', branch });
});

const getBranches = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['address']);

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

  const result = await branchService.getAllBranch(filter, options);
  res.send({ status: true, code: '0000', result });
});

const getBranch = catchAsync(async (req, res) => {
  const result = await branchService.getBranchById(req.params.branchId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Branch not found');
  }
  res.send({ status: true, code: '0000', result });
});

const updateBranch = catchAsync(async (req, res) => {
  const branch = await branchService.updateBranchById(
    req.params.branchId,
    req.body
  );
  res.send({ status: true, code: '0000', branch });
});

const deleteBranch = catchAsync(async (req, res) => {
  await branchService.deleteBranchById(req.params.branchId);
  res.send({
    status: true,
    code: '0000',
    message: 'Branch successfully deleted',
  });
});

module.exports = {
  createBranch,
  getBranch,
  getBranches,
  updateBranch,
  deleteBranch,
};
