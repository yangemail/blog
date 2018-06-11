'use strict';

module.exports = function (app) {
    let locale = require('../controllers/locale.server.controller');

    // Change Website language
    app.route('/locale/:lang')
        .get(locale.localelang);

};