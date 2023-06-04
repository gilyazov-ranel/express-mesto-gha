const { InternslServerError } = require('./InternslServerError');
const { Forbidden } = require('./Forbidden');
const { NotFoundError } = require('./NotFoundError');
const { BadRequest } = require('./BadRequest');
const { Conflict } = require('./Conflict');
const { Unauthorized } = require('./Unauthorized');

module.exports = {
  InternslServerError, Forbidden, NotFoundError, BadRequest, Conflict, Unauthorized,
};
