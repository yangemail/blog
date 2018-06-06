'use strict';

// const dbPath = require('../../config/config').DbPath;
const mongoose = require('mongoose');
const extend = require('mongoose-schema-extend');
// const i18n = require('./i18n');

// use custom mongodb url or localhost
// mongoose.connect(dbPath || "mongodb://localhost/blog");
// const db = mongoose.connection;
//
// db.on('error', function (err) {
//     console.error(i18n.__('error.db_1') + err);
//     process.exit(1);
// });
// exports.mongoose = mongoose;

// 基础 Schema
const base = new mongoose.Schema({
    // 唯一键
    _id: {
        type: String,
        // unique: true
    },
    // 创建时间
    CreatedTime: {
        type: Date
    },
    // 修改时间
    LastModifiedTime: {
        type: Date
    }
});

exports.base = base;