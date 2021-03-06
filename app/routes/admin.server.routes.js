const express = require('express');
const router = express.Router();

module.exports = function (app) {
    const admin = require('../controllers/admin.server.controller');

    // 需要增加 Passport 验证
    app.use('/admin', require('connect-ensure-login').ensureLoggedIn('/login'), router);

    // 网站统计页面 -- INDEX page
    router.get('/', admin.index);

    // 分类管理页面
    router.get('/categorymanage', admin.categorymanage);

    // 获取分类数据，不含所有和未分类，不走缓存
    router.post('/getCategories', admin.getCategories);

    // 获取分类数据，包含所有和未分类，不走缓存
    router.post('/getCateFilter', admin.getCateFilter);

    // 保存分类数据
    router.post('/saveCategories', admin.saveCategories);


    // 文章管理页面
    router.get('/articlemanage', admin.articleManage);

    // 获取文章列表
    router.post('/getArticles', admin.getArticles);

    // 新的文章页面
    router.get('/newArticle', admin.newArticle);

    // 检查文章 Alias 是否唯一
    router.post('/checkArticleAlias', admin.checkArticleAlias);

    // 保存文章
    router.post('/saveArticle', admin.saveArticle);

    // 修改文章
    router.get('/editArticle/:id', admin.editArticle);

    // 删除文章
    router.post('/deleteArticles', admin.deleteArticles);

    // 还原文章
    router.post('/undoArticle', admin.undoArticle);


    // 评论管理页面
    router.get('/comments', admin.comments);

    // 留言管理页面
    router.get('/guestbook', admin.guestbook);

    // 关于管理页面
    router.get('/aboutmanage', admin.aboutmanage);

    // 缓存管理页面
    router.get('/cachemanage', admin.cachemanage);

    // 异常管理页面
    router.get('/exception', require('connect-ensure-login').ensureLoggedIn(), admin.exception);

    // 获取异常数据
    router.post('/getExceptions', admin.getExceptions);

    // 系统设置页面
    router.get('/settings', admin.settings);

    // 保存系统设置
    router.post('/saveSettings', admin.saveSettings);

    // 保存关于数据
    router.post('/saveAbout', admin.saveAbout);

    // 上传图片
    router.post('/uploadimg', admin.uploadImg);

    // 根据缓存key获取缓存
    router.post('/getcache', admin.getcache);

    // 清除指定key的缓存
    router.post('/clearcache', admin.clearcache);
};