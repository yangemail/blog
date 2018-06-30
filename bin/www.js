// set NODE_ENV=production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const configureMongoose = require('../config/mongoose');
const configureExpress = require('../config/express');
// const configurePassport = require('./config/passport');
const debug = require('debug')('blog:www');
var http = require('http');


// *** Make sure that your Mongoose configuration file is loaded before any other configuration is performed in the www.jsle.
const db = configureMongoose();
const app = configureExpress();
// const passport = configurePassport();

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '8082');
app.set('port', port);

/**
 * Create HTTP www
 */
var www = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
www.listen(port);
www.on('error', onError);
www.on('listening', onListening);

// app.listen(8081);
// module.exports = app;

// console.log('Server running at ' + www.address().address + ':' + www.address().port);

/**
 * Normalize a port into a number, string, or false
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP www "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP www "listening" event
 */
function onListening() {
    var addr = www.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}