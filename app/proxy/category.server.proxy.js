'use strict';

const categoryModel = require('../models/category.server.model').CategroyModel;
const postModel = require('../models/post.server.model').PostModel;
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
    if (typeof isAll === 'function') {
        callback = isAll;
        isAll = true;
        cached = true;
    } else if (typeof cached === 'function') {
        callback = cached;
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
            categoryModel.find(function (err, categories) {
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
        categoryModel.find(function (err, categories) {
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

/**
 * 保存分类数据
 * @param array：分类合集
 * @param callback：回调函数
 */
exports.save = function (array, callback) {
    var jsonArray = [];
    var toUpdate = [];
    var updateQuery = [];
    var cateNew;

    if (array.length > 0) {
        array.forEach(function (item) {
            jsonArray.push({
                _id: item.uniqueid || shortid.generate(),
                CateName: item.catename,
                Alias: item.alias,
                Img: item.img,
                Link: item.link,
                CreatedTime: new Date(),
                LastModifiedTime:new Date()
            });
        });
    }

    categoryModel.find(function (err, categories) {
        if (err) {
            return callback(err);
        }

        categories.forEach(function (old) {
            cateNew = tool.jsonQuery(jsonArray, {"_id": old._id});
            if (!cateNew) {
                // 该分类将被删除
                toUpdate.push(old._id);
            } else {
                // 该分类依然存在，则创建时间延用原创建时间
                cateNew.CreatedTime = old.CreatedTime;
                // 若该分类未作任何修改，则修改时间沿用原修改时间
                if (cateNew.CateName.toString() === old.CateName.toString()
                    && cateNew.Alias.toString() === old.Alias.toString()
                    && cateNew.Img === old.Img
                    && cateNew.Link === old.Link) {
                    cateNew.LastModifiedTime = old.LastModifiedTime;
                }
            }
        });

        // 将已经被删除分类的文章设为"未分类"
        if (toUpdate.length > 0) {
            toUpdate.forEach(function (cateId) {
                updateQuery.push({
                    "CategoryId": cateId
                });
            });
            postModel.update({"$or": updateQuery}, {"CategoryId": "other"}, {multi: true}, function (err) {
                if (err) {
                    return callback(err);
                }
            });
        }

        // 将分类全部删除
        categoryModel.remove(function (err) {
            if (err) {
                return callback(err);
            }

            if (jsonArray.length > 0) {
                // 插入全部分类
                // categoryModel.create(jsonArray, function(err) {});
                // 不要用这个，因为这个内部实现依然是循环插入，不是真正的批量插入
                categoryModel.collection.insert(jsonArray, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null);
                });
            } else {
                return callback(null);
            }
        });
    });

};