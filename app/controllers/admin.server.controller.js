const path = require('path');
const fs = require('fs');
const async = require('async');
const upload = require('jquery-file-upload-middleware');
const moment = require('moment');
const shortid = require('shortid');
const category = require('../proxy/category.server.proxy');
const post = require('../proxy/post.server.proxy');
const tool = require('../utility/tool.server.utility');

// 上传配置文件
upload.configure({
    uploadDir: path.join(path.resolve('.'), '/public/images'),
    uploadUrl: '/images'
});

// 网站统计页面
exports.index = function (req, res, next) {
    tool.getConfig('./config/props/settings.json', function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/index', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.web_statistic")
            });
        }
    });
};

// 新的文章页面
exports.newArticle = function (req, res, next) {
    tool.getConfig('./config/props/settings.json', function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/newarticle', {
                uniqueId: shortid.generate(),
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.new_article")
            });
        }
    });
};

// 保存文章
exports.saveArticle = function (req, res, next) {
    var params = {
        UniqueId: req.body.UniqueId,
        Title: req.body.Title,
        Alias: req.body.Alias,
        Summary: req.body.Summary,
        Source: req.body.Source,
        Content: req.body.Content,
        CategoryId: req.body.CategoryId,
        Labels: req.body.Labels,
        Url: req.body.Url,
        IsDraft: req.body.IsDraft
    };
    console.log(params);
};

// 检查文章 Alias 是否唯一
exports.checkArticleAlias = function (req, res, next) {
    post.checkAlias(req.body.Alias, req.body.uid, function (err, isValid) {
        if (err) {
            next(err);
        } else {
            res.json({
                valid: isValid
            });
        }
    });
};

// 获取分类数据，不含所有和未分类，不走缓存
exports.getCategories = function (req, res, next) {
    category.getAll(false, false, function (err, data) {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
};