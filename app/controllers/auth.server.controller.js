'use strict';

const tool = require('../utility/tool.server.utility')
    , path = require('path')
    , passport = require('passport')
    , Strategy = require('passport-local').Strategy
    , logger = require('../utility/logger.server.utility');

passport.use(new Strategy(
    {
        // 页面上的用户名字段的name属性值
        usernameField: 'UserName',
        // 页面上密码字段的name属性值
        passwordField: 'Password'
    },
    function (username, password, cb) {
        let account = require('../../config/props/account');
        // 自己判断用户是否有效
        if (username === account.UserName && password === account.Password) {
            // 验证通过
            return cb(null, account);
        } else {
            // 验证失效
            return cb(null, false);
        }
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user.Id);
});

passport.deserializeUser(function (id, cb) {
    let account = require('../../config/props/account');
    if (account.Id === id) {
        return cb(null, account);
    } else {
        return cb(err);
    }
});

/**
 * 后台登录页面
 * @param req
 * @param res
 * @param next
 */
exports.loginGet = function (req, res, next) {
    tool.getConfig(path.join(__dirname, '../../config/props/settings.json'), function (err, settings) {
        if (err) {
            next(err);
        } else {
            res.render('auth/login', {
                config: settings,
                title: settings['SiteName'] + ' - ' + res.__('auth.title')
            });
        }
    });
};

/**
 * 提交登陆请求
 * @param req
 * @param res
 * @param next
 */
exports.loginPost = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            next(err);
        } else if (!user) {
            logger.errLogger(req, new Error(res.__('auth.wrong_info')));
            res.json({
                valid: false
            });
        } else {
            // 登录操作
            req.logIn(user, function (err) {
                let returnTo = '/admin';
                if (err) {
                    next(err);
                } else {
                    // 尝试跳转之前的页面
                    if (req.session.returnTo) {
                        returnTo = req.session.returnTo;
                    }
                    res.json({
                        valid: true,
                        returnTo: returnTo
                    });
                }
            });
        }
    })(req, res, next);
};

/**
 * 退出登录
 * @param req
 * @param res
 * @param next
 */
exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/login');
};
