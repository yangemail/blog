module.exports = function (app) {
    const index = require('../controllers/demo.index.server.controller');

    app.get('/', index.render);
};