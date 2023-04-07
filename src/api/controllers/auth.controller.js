const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService,
  staffService,
} = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
  const emailActivationToken = await tokenService.generateEmailActivationToken(
    req.body.email
  );
  await emailService.sendEmailActivationEmail(
    req.body.email,
    emailActivationToken
  );
  res.status(httpStatus.CREATED).send({
    status: true,
    code: '0000',
    // message: "User was registered successfully! Please check your email",
    message: 'User successfully registered. Please login using this account',
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const staff = await staffService.getStaffByUserId(user.id);
  res.send({ status: true, code: '0000', user, tokens, staff });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send({ status: true, code: '0000' });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ status: true, code: '0000', ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.send({
    status: true,
    code: '0000',
    message: `Reset password successfully sent. Please check your email, ${req.body.email}`,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.send({
    status: true,
    code: '0000',
    message:
      'New password updated, please login using newly registered password',
  });
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(
    req.body.userId,
    req.body.oldPassword,
    req.body.newPassword
  );
  res.send({
    status: true,
    code: '0000',
    message: 'new password successfully updated',
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.send({
    status: true,
    code: '0000',
    message: 'Account verified. Please try to login using this email',
  });
});

const getUserProfile = catchAsync(async (req, res) => {
  const accessToken = req.headers['authorization'].split(' ');
  const user = await authService.getUserProfile(accessToken[1]);
  const staff = await staffService.getStaffByUserId(user.id);
  res.send({ status: true, code: '0000', user, staff });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getUserProfile,
  changePassword,
};
