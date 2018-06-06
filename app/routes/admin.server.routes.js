module.exports = function (app) {
    const admin = require('../controllers/admin.server.controller');

    app.get('/admin/', admin.index);

    app.get('/admin/newArticle', admin.newArticle);

    app.post('/admin/saveArticle', admin.saveArticle);

    app.post('/admin/checkArticleAlias', admin.checkArticleAlias);
}