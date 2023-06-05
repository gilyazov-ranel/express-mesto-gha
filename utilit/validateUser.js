/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      /https*\:\/\/w{0,3}\.*[a-z0-9\-]*\.ru[a-z0-9\/]*/,
    ),
  }),
});

module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

module.exports.validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validationUpdateAvatarUser = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(
      /https*\:\/\/w{0,3}\.*[a-z0-9\-]*\.ru[a-z0-9\/]*/,
    ),
  }),
});

module.exports.validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
