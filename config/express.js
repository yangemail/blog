const config = require('./config');

// 加载 body-parser，用来处理 post 提交过来的数据
const bodyParser = require('body-parser');
// 加载网页压缩模块
const compress = require('compression');
const consolidate = require('consolidate');
const cookieParser = require('cookie-parser');
// 加载 express 模块
const express = require('express');
const flash = require('connect-flash');
const methodOverride = require('method-override');
// 加载日志信息
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
// 加载 swig-templates 模块
const swig = require('swig-templates');


module.exports = function () {
    // 创建app应用 => NodeJS Http.createServer();
    const app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // app.use(cookieParser);
    app.use(session({
        saveUninitialized: true,
        resave: true,
        cookie: {maxAge: 30 * 60 * 1000},
        secret: config.sessionSecret
    }));

    // 配置应用模板
    // 定义当前应用所使用的模板引擎
    // 第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
    app.engine('html', consolidate.swig);
    // 设置模板文件存放的目录，第一个参数必须是views, 第二个参数是目录
    app.set('view', './app/views');
    // 注册所使用的模板引擎，第一个参数必须是view engine，
    // 第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
    app.set('view engine', 'html');
    // 在开发过程中，需要取消模板缓存
    if (process.env.NODE_ENV === 'development') {
        swig.setDefaults({cache: false});
    }

    app.use(flash());
    // app.use(passport.initialize());
    // app.use(passport.session());


    // 设置Cookie
    app.use(require('../app/routes/users.server.routes').validateAdmin(app));

    // Routers
    // require('../app/routes/index.server.routes')(app);
    require('../app/routes/users.server.routes')(app);


    // 设置静态文件托管
    // 当用户访问的 url 以 /public 开始，那么直接返回对应的 __dirname + '/public' 下的文件
    app.use(express.static('./public'));

    return app;
}