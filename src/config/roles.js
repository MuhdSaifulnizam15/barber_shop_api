const roles = ['staff', 'manager', 'admin'];

const roleRights = new Map();

const getPermissionList = [
  'getUser',
  'getUsers',
  'getDashboard',
  'getUserProfile',
  'getCategory',
  'getCategories',
  'getService',
  'getServices',
  'getBranch',
  'getBranches',
  'getStaff',
  'getStaffs',
  'getCustomer',
  'getCustomers',
  'getSale',
  'getSales',
  'changePassword',
];

const staffPermissionList = ['manageSale'];

const managerManagePermissionList = [
  'manageUsers',
  'manageCategory',
  'manageService',
  'manageBranch',
  'manageStaff',
  'manageCustomer',
  'manageSale',
];

const adminManagePermissionList = [
  'manageUsers',
  'manageCategory',
  'manageService',
  'manageBranch',
  'manageStaff',
  'manageCustomer',
  'manageSale',
];

roleRights.set(roles[0], staffPermissionList.concat(getPermissionList));
roleRights.set(
  roles[1],
  managerManagePermissionList.concat(getPermissionList, staffPermissionList)
);
roleRights.set(
  roles[2],
  adminManagePermissionList.concat(getPermissionList, staffPermissionList)
);

module.exports = {
  roles,
  roleRights,
};
