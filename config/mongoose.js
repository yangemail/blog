const config = require('./config');

// 加载数据库模块
const mongoose = require('mongoose');

module.exports = function () {
    const db = mongoose.connect(config.db);

    // Model
    // require('../app/models/demo.user.server.model');

    console.log('Mongodb running at ' + config.db);

    return db;
}