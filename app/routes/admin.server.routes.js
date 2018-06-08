const express = require('express');
const router = express.Router();

module.exports = function (app) {
    const admin = require('../controllers/admin.server.controller');

    // app.get('/admin/', admin.index);
    //
    // app.get('/admin/newArticle', admin.newArticle);
    //
    // app.post('/admin/saveArticle', admin.saveArticle);
    //
    // app.post('/admin/checkArticleAlias', admin.checkArticleAlias);
    //
    // app.post('/admin/getCategories', admin.getCategories);

    router.get('/', admin.index);

    router.get('/newArticle', admin.newArticle);

    router.post('/saveArticle', admin.saveArticle);

    router.post('/checkArticleAlias', admin.checkArticleAlias);

    router.post('/getCategories', admin.getCategories);

    // 需要增加 Passport 验证
    app.use('/admin', router);
}