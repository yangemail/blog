// set NODE_ENV=production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const configureMongoose = require('./config/mongoose');
const configureExpress = require('./config/express');
const configurePassport = require('./config/passport');


// *** Make sure that your Mongoose configuration file is loaded before any other configuration is performed in the server.js file.
const db = configureMongoose();
const app = configureExpress();
// const passport = configurePassport();

app.listen(8081);

module.exports = app;

console.log('Server running at http://localhost:8081/');