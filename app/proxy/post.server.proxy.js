"use strict"

const postModel = require('../models/post.server.model').PostModel;
const redisClient = require('../utility/redisClient.server.utility');
const tool = require('../utility/tool.server.utility');


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