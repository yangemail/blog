// const dbPath = require('./config').DbPath;
const i18n = require('./i18n');

const config = require('./config');

// 加载数据库模块
const mongoose = require('mongoose');

module.exports = function () {
    // use custom mongodb url or localhost
    mongoose.connect(config.db);
    const db = mongoose.connection;

    db.on('error', function (err) {
        console.error(i18n.__('error.db_1') + err);
        process.exit(1);
    });

    // Models
    require('../app/models/db.server.model');
    require('../app/models/post.server.model');
    require('../app/models/category.server.model');
    require('../app/models/log.server.model');

    console.log('Mongodb running at ' + config.db);

    return db;
}