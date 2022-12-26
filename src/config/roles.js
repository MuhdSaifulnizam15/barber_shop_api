const roles = ["staff", "admin"];

const roleRights = new Map();

const getPermissionList = [
  "getUser",
  "getUsers",
  "getDashboard",
  "getUserProfile",
  "getCategory",
  "getCategories",
];
const staffPermissionList = [];
const adminManagePermissionList = ["manageUsers","manageCategory"];

roleRights.set(roles[0], staffPermissionList.concat(getPermissionList));
roleRights.set(
  roles[1],
  adminManagePermissionList.concat(getPermissionList, staffPermissionList)
);

module.exports = {
  roles,
  roleRights,
};
