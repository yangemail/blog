'use strict';

const db = require('./db.server.model');
const mongoose = require('mongoose');;
const base = db.base;

const PostSchema = base.extend({
    // 标题
    Title: {type: String},
    // 文章别名
    Alias: {type: String},
    // 摘要
    Summary: {type: String},
    // 来源
    Source: {type: String},
    // 内容
    Content: {type: String},
    // 分类ID
    CategoryId: {type: String},
    // 标签
    Labels: {type: String},
    // 外链URL
    Url: {type: String},
    // 浏览次数
    ViewCount: {type: Number},
    // 是否草稿
    IsDraft: {type: Boolean},
    // 是否有效
    IsActive: {type: Boolean, default: true}
});

exports.PostModel = mongoose.model('post', PostSchema);