'use strict';

const categoryModel = require('../models/category.server.model').CategroyModel;
const post = require('../models/post.server.model').PostModel;
const shortid = require('shortid');
const tool = require('../utility/tool.server.utility');
const redisClient = require('../utility/redisClient.server.utility');
const i18n = require('../../config/i18n');

// 全部分类
var cateAll = {
    "_id": "",
    "Alias": "",
    "CateName": i18n.__("Category.all"),
    "Img": "/images/全部分类.svg"
};

// 未分类
var cateOther = {
    "_id": "other",
    "Alias": "other",
    "CateName": i18n.__("Category.uncate"),
    "Img": "/images/未分类.svg"
};

/**
 * 获取分类数据
 * @param isAll：是否包含全部分类和未分类
 * @param cached：是否读取缓存
 * @param callback：回调函数
 */
exports.getAll = function (isAll, cached, callback) {
    if (typeof cached === 'function') {
        callback = cached;
        cached = true;
    } else if (typeof isAll === 'function') {
        callback = isAll;
        isAll = true;
        cached = true;
    }

    // 缓存的 key 名称
    var cache_key = isAll ? 'categorys_all' : 'categories';
    if (cached) {
        // 尝试读取缓存
        redisClient.getItem(cache_key, function (err, categories) {
            // 读取缓存出错
            if (err) {
                return callback(err);
            }
            // 缓存中有数据
            if (categories) {
                return callback(null, categories);
            }
            // 缓存中没有数据，则从数据库中读取
            categoryModel.find({}, function (err, categories) {
                // 读取数据库出错
                if (err) {
                    return callback(err);
                }
                if (isAll) {
                    categories.unshift(cateAll);
                    categories.push(cateOther);
                }
                // 从数据库中读到数据
                if (categories) {
                    // 将数据塞入缓存
                    redisClient.setItem(cache_key, categories, redisClient.defaultExpired, function (err) {
                        if (err) {
                            return callback(err);
                        }
                    });
                }
                return callback(null, categories);
            });
        });
    } else {
        categoryModel.find({}, function (err, categories) {
            if (err) {
                return callback(err);
            }
            if (isAll) {
                categories.unshift(cateAll);
                categories.push(cateOther);
            }
            return callback(null, categories);
        });
    }
};