'use strict';

const express = require('express');

module.exports = function (app) {
    let locale = require('../controllers/locale.server.controller');

    // TODO: Change Website language
    app.route('/locale/:lang')
        .get(locale.localelang);

};