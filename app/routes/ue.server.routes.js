module.exports = function (app) {
    const ue = require('../controllers/ue.server.controller');

    app.get('/ue/controller', ue.indexGet)
        .post(ue.indexPost);
}