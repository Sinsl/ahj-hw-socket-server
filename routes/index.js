const combineRouters = require('koa-combine-routers');

const index = require('./index/index');
const ticket = require('./ticket/ticket');
const users = require('./users/users');
//const message = require('./message/message')

const router = combineRouters(
  index,
  ticket,
  users,
  // message,
  
);

module.exports = router;