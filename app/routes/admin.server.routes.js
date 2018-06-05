module.exports = function (app) {
    const admin = require('../controllers/admin.server.controller');

    app.get('/admin/', admin.index);

    app.get('/admin/newArticle', admin.newArticle);
}