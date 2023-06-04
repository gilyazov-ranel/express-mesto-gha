/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

module.exports.validateCardJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(
      /https*\:\/\/w{0,3}\.*[a-z0-9\-]*\.ru[a-z0-9\/]*/,
    ),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});
