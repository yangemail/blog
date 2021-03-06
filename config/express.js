'use strict';

const config = require('./config');

// 加载 express 模块
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

// 加载日志信息
const morgan = require('morgan');

const cookieParser = require('cookie-parser');
const session = require('express-session');
// 加载 body-parser，用来处理 post 提交过来的数据
const bodyParser = require('body-parser');
// 加载网页压缩模块
const compress = require('compression');

const logger = require('./../app/utility/logger.server.utility');
const i18n = require('./i18n');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

// 加载 swig-templates 模块
const swig = require('swig-templates');

module.exports = function () {
    // 创建app应用 => NodeJS Http.createServer();
    const app = express();

    // ------ view engine setup ------
    // 配置应用模板
    // 定义当前应用所使用的模板引擎
    // 第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
    app.engine('html', swig.renderFile);
    // 设置模板文件存放的目录，第一个参数必须是views, 第二个参数是目录
    app.set('views', path.join('./views'));

    // 注册所使用的模板引擎，第一个参数必须是view engine，
    // 第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
    app.set('view engine', 'html');


    // uncomment after placing your favicon in /public
    app.use(favicon(path.join('./public', 'favicon.ico')));

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
        // 在开发过程中，需要取消模板缓存
        swig.setDefaults({cache: false});
        swig.invalidateCache();
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    // i18n init parses req for language headers, cookies, etc.
    app.use(i18n.init);
    // app.use(methodOverride());
    app.use(session({
        secret: config.sessionSecret,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        },
        resave: true,
        saveUninitialized: true
    }));


    // 设置静态文件托管
    // 当用户访问的 url 以 /public 开始，那么直接返回对应的 __dirname + '/public' 下的文件
    app.use(express.static(path.join('./public')));


    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());


    // **** Routes ****
    /* Index */
    require('../app/routes/index.server.routes')(app);
    /* Locale */
    require('../app/routes/locale.server.routes')(app);
    /* Misc */
    // app.use('/', misc);
    /* Auth */
    require('../app/routes/auth.server.routes')(app);
    /* Blog */
    // app.use('/blog', blog);
    /* Admin */
    // app.use('/admin', require('connect-ensure-login').ensureLoggedIn('/login'), admin);
    require('../app/routes/admin.server.routes')(app);
    /* Ue */
    require('../app/routes/ue.server.routes')(app);


    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error();
        err.status = 404;
        next(err);
    });

    // error handlers
    app.use(function (err, req, res, next) {
        var code = err.status || 500;
        var message = code === 404 ? res.__('error.404_1') : res.__('error.404_2');
        res.status(code);
        logger.errLogger(req, err);
        res.render('./shared/error', {
            code: code,
            message: message
        });
    });

    return app;
};