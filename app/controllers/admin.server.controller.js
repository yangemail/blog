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
    tool.getConfig(path.join(path.resolve('.'), 'config/json/settings.json'), function (err, settings) {
        if (err) {
            next(err);
            console.log(err);
        } else {
            console.log('hello!');
            res.render('admin/index', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__("layoutAdmin.web_statistic")
            });
        }
    });
};