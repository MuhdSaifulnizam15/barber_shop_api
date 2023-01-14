const httpStatus = require("http-status");
const moment = require("moment");
const { Sale } = require("../models");
const ApiError = require("../utils/ApiError");
const { getBranchById } = require("./branch.service");
const { getCustomerById, updateCustomerPoints } = require("./customer.service");
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

    // TODO: add customer
  }
  userBody.customer_id = customer._id;

  const sale = await Sale.create(userBody);

  // update customer total_redeemed_point and total_spend
  const updateCustPointsBody = {
    total_redeemed_point: userBody?.total_redeemed_point || 0,
    total_rewarded_point: userBody.total_rewarded_point,
    total_spend: userBody.total,
  };

  const updateCustPointsBodyRes = await updateCustomerPoints(
    userBody.customer_id,
    updateCustPointsBody
  );
  return sale;
};

const querySales = async (options) => {
  options.populate = ["branch_id", "barber_id", "customer_id", "order.service"];
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

const getChartData = async (chartType) => {
  let label = [],
    data = [];
  switch (chartType) {
    case "daily":
      label = [
        moment().format("DD MMM YYYY"),
        moment().subtract(1, "day").format("DD MMM YYYY"),
        moment().subtract(2, "day").format("DD MMM YYYY"),
        moment().subtract(3, "day").format("DD MMM YYYY"),
        moment().subtract(4, "day").format("DD MMM YYYY"),
        moment().subtract(5, "day").format("DD MMM YYYY"),
      ].reverse();

      // data = await Sale.aggregate([
        // {
        //   $match: {
        //     createdAt: {
        //       $gte: moment().subtract(5, "day").toISOString(),
        //       $lte: moment().toISOString(),
              
        //     },
        //   },
        // },
        // {
        //   $group: {
        //     _id: "$total", //{ name: "$name"},
        //     totalSales: { $sum: "$total" },
        //   },
        // },
        // { $project: { _id: 1, qty: "$totalSales" } },
      // ]);

      data = [ 200, 450, 1000, 800, 300, 700]

      return {
        data,
        label,
      };
      break;

    case "week":
      label = [
        moment().startOf("week").format("DD MMM YYYY"),
        moment().subtract(1, "weeks").startOf("week").format("DD MMM YYYY"),
        moment().subtract(2, "weeks").startOf("week").format("DD MMM YYYY"),
        moment().subtract(3, "weeks").startOf("week").format("DD MMM YYYY"),
        moment().subtract(4, "weeks").startOf("week").format("DD MMM YYYY"),
        moment().subtract(5, "weeks").startOf("week").format("DD MMM YYYY"),
      ].reverse();

      // data = await Sale.aggregate([
      //   {
      //     $match: {
      //       createdAt: {
      //         $gte: moment()
      //           .subtract(5, "weeks")
      //           .startOf("week")
      //           .format("DD MMM YYYY"),
      //         $lte: moment().startOf("week").format("DD MMM YYYY"),
      //       },
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$total", //{ name: "$name"},
      //       totalSales: { $sum: "$total" },
      //     },
      //   },
      //   { $project: { _id: 1, qty: "$totalSales" } },
      // ]);

      data = [
        2500, 5000, 4500, 9950, 10500, 10800
      ]

      return {
        data,
        label,
      };
      break;

    case "month":
      label = [
        moment().startOf("month").format("MMM YYYY"),
        moment().subtract(1, "month").startOf("month").format("MMM YYYY"),
        moment().subtract(2, "month").startOf("month").format("MMM YYYY"),
        moment().subtract(3, "month").startOf("month").format("MMM YYYY"),
        moment().subtract(4, "month").startOf("month").format("MMM YYYY"),
        moment().subtract(5, "month").startOf("month").format("MMM YYYY"),
      ].reverse();

      data = [
        30500, 29800, 25050, 31790, 32456, 34789
      ]

      return {
        data,
        label,
      };
      break;

    case "annual":
      label = [
        moment().startOf("year").format("YYYY"),
        moment().subtract(1, "year").startOf("year").format("YYYY"),
        moment().subtract(2, "year").startOf("year").format("YYYY"),
      ].reverse();

      data = [
        80560, 98790, 50678
      ]

      return {
        data,
        label,
      };
      break;
  }
};

const getTotalSales = async () => {
  let today = 0,
    past_3_day = 0,
    last_week = 0,
    last_month = 0;

  // total sales today
  const salesToday = await Sale.find({
    createdAt: {
      $gte: moment().startOf("day"),
      $lt: moment().endOf("day"),
    },
  });

  today = salesToday.reduce((a, b) => +a + +b.total, 0);

  // total sales for past 3 day
  const salesPast3Day = await Sale.find({
    createdAt: {
      $gte: moment().subtract(3, "day").startOf("day"),
      $lt: moment().endOf("day"),
    },
  });

  past_3_day = salesPast3Day.reduce((a, b) => +a + +b.total, 0);

  // total sales for last week
  const salesLastWeek = await Sale.find({
    createdAt: {
      $gte: moment().subtract(1, "weeks").startOf("week"),
      $lt: moment().subtract(1, "weeks").endOf("week"),
    },
  });

  last_week = salesLastWeek.reduce((a, b) => +a + +b.total, 0);

  // total sales today
  const salesLastMonth = await Sale.find({
    createdAt: {
      $gte: moment().subtract(1, "month").startOf("month"),
      $lt: moment().subtract(1, "month").endOf("month"),
    },
  });

  last_month = salesLastMonth.reduce((a, b) => +a + +b.total, 0);

  return {
    today,
    past_3_day,
    last_week,
    last_month,
  };
};

module.exports = {
  createSale,
  querySales,
  getSaleById,
  updateSaleById,
  deleteSaleById,
  getTotalSales,
  getChartData,
};
