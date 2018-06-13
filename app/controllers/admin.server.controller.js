const path = require('path');
const fs = require('fs');
const async = require('async');
const upload = require('jquery-file-upload-middleware');
const postProxy = require('../proxy/post.server.proxy');
const categoryProxy = require('../proxy/category.server.proxy');
const log = require('../proxy/log.server.proxy');
const tool = require('../utility/tool.server.utility');
const moment = require('moment');
const shortid = require('shortid');
const redisClient = require('../utility/redisClient.server.utility');

// 上传配置文件
upload.configure({
    uploadDir: path.join(path.resolve('.'), '/public/images'),
    uploadUrl: '/images'
});

// 网站统计页面
exports.index = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
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

// 分类管理页面
exports.categorymanage = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/categorymanage', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__('layoutAdmin.classified_management')
            });
        }
    });
};

// 新的文章页面
exports.newArticle = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
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

    postProxy.save(params, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
};

/**
 * 获取文章列表
 * @param req
 * @param res
 * @param next
 */
exports.getArticles = function (req, res, next) {
    var filter;
    var params = {
        pageIndex: req.body.pageNumber,
        pageSize: req.body.pageSize,
        sortName: req.body.sortName,
        sortOrder: req.body.sortOrder,
        searchText: req.body.searchText
    };

    if (req.body.filter) {
        filter = JSON.parse(req.body.filter);
        params.cateId = filter.CateName;
        params.uniqueId = filter.UniqueId;
        params.title = filter.Title;
    }

    async.parallel([
        // 获取文章列表
        function (cb) {
            postProxy.getArticles(params, function (err, posts) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, posts);
                }
            });
        },
        // 获取文章总数
        function (cb) {
            postProxy.getArticlesCount(params, function (err, count) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, count);
                }
            });
        },
        // 获取分类
        function (cb) {
            categoryProxy.getAll(true, false, function (err, categories) {
                if (err) {
                    callback(err);
                } else {
                    cb(null, categories);
                }
            });
        }
    ], function (err, results) {
        var posts;
        var count;
        var categories;
        var post;
        var cateId;
        var cateItem;
        var result = [];
        if (err) {
            next(err);
        } else {
            posts = results[0];
            count = results[1];
            categories = results[2];
            posts.forEach(function (item) {
                post = {
                    UniqueId: item._id,
                    Alias: item.Alias,
                    Title: item.Title,
                    CreatedTime: moment(item.CreatedTime).format('YYYY-MM-DD HH:mm:ss'),
                    LastModifiedTime: moment(item.LastModifiedTime).format('YYYY-MM-DD HH:mm:ss'),
                    Summary: item.Summary,
                    ViewCount: item.ViewCount,
                    Source: item.Source,
                    Url: item.Url,
                    IsDraft: item.IsDraft,
                    IsActive: item.isActive
                };
                cateId = item.CategoryId;
                cateItem = tool.jsonQuery(categories, {"_id": cateId});
                if (cateItem) {
                    post.CategoryAlias = cateItem.Alias;
                    post.CateName = cateItem.CateName;
                }
                result.push(post);
            });
            res.json({
                rows: result,
                total: count
            });
        }
    });
};

// 检查文章 Alias 是否唯一
exports.checkArticleAlias = function (req, res, next) {
    postProxy.checkAlias(req.body.Alias, req.body.uid, function (err, isValid) {
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
    categoryProxy.getAll(false, false, function (err, data) {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });
};

/**
 * 保存分类数据
 * @param req
 * @param res
 * @param next
 */
exports.saveCategories = function (req, res, next) {
    var jsonArray = JSON.parse(req.body.json.substr(1, req.body.json.length - 2));
    categoryProxy.save(jsonArray, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
};

/**
 * 上传图片
 * @param req
 * @param res
 * @param next
 */
exports.uploadImg = function (req, res, next) {
    upload.fileHandler()(req, res, next);
};

/**
 * 文章管理页面
 * @param req
 * @param res
 * @param next
 */
exports.articleManage = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/articlemanage', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__('layoutAdmin.article_management')
            });
        }
    });
};

/**
 * 评论管理页面
 * @param req
 * @param res
 * @param next
 */
exports.comments = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/comments', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__('layoutAdmin.comment_management')
            });
        }
    });
};

/**
 * 留言管理页面
 * @param req
 * @param res
 * @param next
 */
exports.guestbook = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/guestbook', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__('layoutAdmin.msg_management')
            });
        }
    });
};

/**
 * 关于管理页面
 * @param req
 * @param res
 * @param next
 */
exports.aboutmanage = function (req, res, next) {
    async.parallel([
        // 获取关于数据
        function (cb) {
            tool.getConfig(path.join(__dirname, '../../config/props/about.json'), function (err, about) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, about);
                }
            });
        },
        // 获取配置
        function (cb) {
            tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, settings);
                }
            });
        }
    ], function (err, results) {
        var settings;
        var about;
        if (err) {
            next(err);
        } else {
            about = results[0];
            settings = results[1];
            res.render('admin/aboutmanage', {
                title: settings['SiteName'] + ' - ' + res.__('layoutAdmin.about_management'),
                about: about,
                config: settings
            });
        }
    });
};

/**
 * 保存关于数据
 * @param req
 * @param res
 * @param next
 */
exports.saveAbout = function (req, res, next) {
    tool.setConfig(path.join(__dirname, '../../config/props/about.json'), {
        FirstLine: req.body.FirstLine,
        SecondLine: req.body.SecondLine,
        PhotoPath: req.body.PhotoPath,
        ThirdLine: req.body.ThirdLine,
        Profile: req.body.Profile,
        Wechat: req.body.Wechat,
        QrcodePath: req.body.QrcodePath,
        Email: req.body.Email
    });
    res.end();
};

/**
 * 缓存管理页面
 * @param req
 * @param res
 * @param next
 */
exports.cachemanage = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/cachemanage', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__('layoutAdmin.cache_management')
            });
        }
    });
};

/**
 * 根据缓存key获取缓存
 * @param req
 * @param res
 * @param next
 */
exports.getcache = function (req, res, next) {
    redisClient.getItem(req.body.key, function (err, data) {
        if (err) {
            next(err);
        } else {
            if (data) {
                res.json(data);
            } else {
                res.end();
            }
        }
    });
};

exports.clearcache = function (req, res, next) {
    redisClient.removeItem(req.body.key, function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
};

exports.exception = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('admin/exception', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__('layoutAdmin.exception_management')
            });
        }
    });
};

exports.getExceptions = function (req, res, next) {
    var params = {
        pageIndex: req.body.pageNumber,
        pageSize: req.body.pageSize,
        sortName: req.body.sortName,
        sortOrder: req.body.sortOrder
    };

    async.parallel([
        // 获取异常列表
        function (cb) {
            log.getAll(params, function (err, logs) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, logs);
                }
            });
        },
        // 获取异常总数
        function (cb) {
            log.getAllCount(params, function (err, count) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, count);
                }
            });
        }
    ], function (err, results) {
        let logs
            , count
            , result = [];
        if (err) {
            next(err);
        } else {
            logs = results[0];
            count = results[1];
            logs.forEach(function (item) {
                result.push({
                    message: item.message,
                    time: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS'),
                    level: item.level,
                    meta: item.meta
                });
            });
            res.json({
                rows: result,
                total: count
            });
        }
    });
};