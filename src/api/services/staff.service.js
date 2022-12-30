const httpStatus = require("http-status");
const { Staff } = require("../models");
const ApiError = require("../utils/ApiError");
const { getBranchById } = require("./branch.service");

const createStaff = async (userBody) => {
  if (await Staff.isPhoneNumberTaken(userBody.phone_no)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "staff phone number already exist.");
  }
  const branch = await getBranchById(userBody.branch_id);
  if (!branch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "branch not found.");
  }
  userBody.branch_id = branch._id;
  const staff = await Staff.create(userBody);
  return staff;
};

const queryStaffs = async (options) => {
  options.populate = ['branch_id'];
  const staffs = await Staff.paginate({}, options);
  return staffs;
};

const getStaffById = async (id) => {
  return Staff.findById(id);
};

const getStaffByName = async (name) => {
  return Staff.findOne({ fullname: name });
};

const updateStaffById = async (staffId, updateBody) => {
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Staff not found");
  }
  Object.assign(staff, updateBody);
  await staff.save();
  return staff;
};

const deleteStaffById = async (staffId) => {
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
  }
  await staff.remove();
  return staff;
};

module.exports = {
  createStaff,
  queryStaffs,
  getStaffById,
  getStaffByName,
  updateStaffById,
  deleteStaffById,
};
