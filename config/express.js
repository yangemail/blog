const config = require('./config');

const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
// const passport = require('passport');
const consolidate = require('consolidate');


module.exports = function () {
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
        // cookie: {maxAge: 30 * 60 * 1000},
        secret: config.sessionSecret
    }));

    // app.engine('html', consolidate.swig);
    // app.set('view', './app/views');
    // app.set('view engine', 'html');
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    // app.use(passport.initialize());
    // app.use(passport.session());

    // Routers
    require('../app/routes/index.server.routes')(app);

    app.use(express.static('./public'));

    return app;
}