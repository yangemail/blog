const path = require('path');
const fs = require('fs');
const async = require('async');
const upload = require('jquery-file-upload-middleware');
const moment = require('moment');
const shortid = require('shortid');

const tool = require('../../utility/tool');

// 上传配置文件
upload.configure({
    uploadDir: path.join(path.resolve('.'), '/public/images'),
    uploadUrl: '/images'
});

// 网站统计页面
exports.index = function (req, res, next) {
    tool.getConfig(path.join('./config/json/settings.json'), function (err, settings) {
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
    tool.getConfig(path.join('./config/json/settings.json'), function (err, settings) {
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