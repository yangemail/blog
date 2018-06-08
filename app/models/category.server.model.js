'use strict';

const db = require('./db.server.model');
const mongoose = require('mongoose');
const base = db.base;

const categorySchema = base.extend({
    // 分类名称
    CateName: {type: String},
    // 分类别名
    Alias: {type: String},
    // 图标地址
    Img: {type: String},
    // 链接地址
    Link: {type: String}
});

exports.CategroyModel = mongoose.model('category', categorySchema);