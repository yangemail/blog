"use strict"

const postModel = require('../models/post.server.model').PostModel;
const redisClient = require('../utility/redisClient.server.utility');
const tool = require('../utility/tool.server.utility');

/**
 * 判断文章的Alias是否唯一
 * @param alias：文章Alias
 * @param articleId：文章Id
 * @param callback：回调函数
 */
exports.checkAlias = function (alias, articleId, callback) {
    postModel.findOne({"Alias": alias}, function (err, article) {
        if (err) {
            return callback(err);
        }
        if (!article) {
            return callback(null, true);
        } else {
            if (article._id === articleId) {
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        }
    });
};

/**
 * 新增或者更新文章
 * @param params：参数对象
 * @param callback：回调函数
 */
exports.save = function (params, callback) {
    var _id = params.UniqueId;
    var entity = new postModel({
        Title: params.Title,
        Alias: params.Alias,
        Summary: params.Summary,
        Source: params.Source,
        Content: params.Content,
        CategoryId: params.CategoryId,
        Labels: params.Labels,
        Url: params.Url,
        IsDraft: params.IsDraft === 'True',
        IsActive: true,
        LastModifiedTime: new Date()
    });

    postModel.findById(_id, function (err, article) {
        if (err) {
            return callback(err);
        }

        if (!article) {
            // 新增
            entity._id = _id;
            entity.ViewCount = 0;
            entity.CreatedTime = new Date();
            entity.save(function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
        } else {
            // 更新
            postModel.update({"_id": _id}, entity, function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
        }
    });
};

/**
 * 为后台数据查询构建条件对象
 * @param params
 */
function getArticlesQuery(params) {
    var query = {};
    if (params.cateId) {
        query.CategoryId = params.cateId;
    }
    if (params.uniqueId) {
        query._id = params.uniqueId;
    }
    if (params.title) {
        query.Title = {"$regex": params.title, "$options": "gi"};
    }
    if (params.searchText) {
        query.$or = [
            {
                "Alias": {
                    "$regex": params.searchText,
                    "$options": "gi"
                }
            },
            {
                "Title": {
                    "$regex": params.searchText,
                    "$options": "gi"
                }
            },
            {
                "Summary": {
                    "$regex": params.searchText,
                    "$options": "gi"
                }
            },
            {
                "Content": {
                    "$regex": params.searchText,
                    "$options": "gi"
                }
            },
            {
                "Labels": {
                    "$regex": params.searchText,
                    "$options": "gi"
                }
            },
            {
                "Url": {
                    "$regex": params.searchText,
                    "$options": "gi"
                }
            }
        ]
    }
    return query;
}

/**
 * 获取管理页面的文章数
 * @param params：参数对象
 * @param callback：回调函数
 */
exports.getArticlesCount = function (params, callback) {
    var query = getArticlesQuery(params);
    postModel.count(query, function (err, count) {
        if (err) {
            callback(err);
        }
        return callback(null, count);
    });
};

/**
 * 获取管理页面的文章数据
 * @param params：参数对象
 * @param callback：回调函数
 */
exports.getArticles = function (params, callback) {
    var page = parseInt(params.pageIndex) || 1;
    var size = parseInt(params.pageSize) || 10;
    page = page > 0 ? page : 1;
    var options = {};
    options.skip = (page - 1) * size;
    options.limit = size;

    switch (params.sortName) {
        case 'ModifyTime':
            options.sort = params.sortOrder === 'desc' ? '-LastModifiedTime -CreatedTime' : 'LastModifiedTime CreatedTime';
            break;
        case 'ViewCount':
            options.sort = params.sortOrder === 'desc' ? '-ViewCount -CreatedTime' : 'ViewCount CreatedTime';
            break;
        default:
            options.sort = params.sortOrder === 'desc' ? '-CreatedTime' : 'CreatedTime';
            break;
    }
    var query = getArticlesQuery(params);
    postModel.find(query, {}, options, function (err, posts) {
        if (err) {
            return callback(err);
        }
        return callback(null, posts);
    });
};
