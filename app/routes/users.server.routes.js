const users = require('../controllers/users.server.controller');
const passport = require('passport');

exports.validateAdmin = users.validateAdmin(app);

module.exports = function (app) {

    // 设置Cookie
    // app.use(users.validateAdmin);




}