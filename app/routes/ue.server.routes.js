module.exports = function (app) {
    const ue = require('../controllers/ue.server.controller');

    app.route('/ue/controller')
        .get(ue.indexGet)
        .post(ue.indexPost);
};