const nodemailer = require("nodemailer");
const config = require("../../config/config");
const logger = require("../../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch((err) =>
      logger.warn(
        `Unable to connect to email server. Make sure you have configured the SMTP options in .env, ${err}`
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.url_app}/auth/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send account activation email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendEmailActivationEmail = async (to, token) => {
  const subject = "Email Confirmation";
  const activationUrl = `${config.url}:${config.port}/api/v1/auth/verify-email?token=${token}`;
  const text = `Dear user, 

  Please click this link to activate your account: ${activationUrl}
  
  Default password is set to Rolex@12345.

  Please be reminded to update your password once logged in as your account could be compromised by someone.

  If you did not request for any email activation, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendEmailActivationEmail,
};
