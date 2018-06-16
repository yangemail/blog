const path = require('path')
    , async = require('async')
    , categoryProxy = require('../proxy/category.server.proxy')
    , toolUtil = require('../utility/tool.server.utility');

exports.render = function (req, res, next) {
    async.parallel([
        // 获取配置
        function (cb) {
            toolUtil.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        },
        // 获取分类
        function (cb) {
            categoryProxy.getAll(function (err, categories) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, categories);
                }
            });
        }
    ], function (err, results) {
        let settings
            , categories;
        if (err) {
            next(err);
        } else {
            settings = results[0];
            categories = results[1];
            res.render('blog/index', {
                cateData: categories,
                config: settings,
                title: settings['SiteName'],
                currentCate: '',
                isRoot: true
            });
        }
    });
};