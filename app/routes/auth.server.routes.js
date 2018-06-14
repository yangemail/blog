'use strict';

module.exports = function (app) {
    const auth = require('../controllers/auth.server.controller');

    app.route('/login')
        .get(auth.loginGet)
        .post(auth.loginPost);

    app.route('/logout')
        .post(auth.logout);
};