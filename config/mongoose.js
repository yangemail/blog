const config = require('./config');
const mongoose = require('mongoose');

module.exports = function () {
    const db = mongoose.connect(config.db);

    // Model
    // require('../app/models/user.server.model');

    console.log('Mongodb running at ' + config.db);

    return db;
}