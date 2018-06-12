const express = require('express');
const router = express.Router();

module.exports = function (app) {
    const admin = require('../controllers/admin.server.controller');

    // 需要增加 Passport 验证
    app.use('/admin', router);

    // 网站统计页面 -- INDEX page
    router.get('/', admin.index);

    // 分类管理页面
    router.get('/categorymanage', admin.categorymanage);

    // 获取分类数据，不含所有和未分类，不走缓存
    router.post('/getCategories', admin.getCategories);

    // TODO: 获取分类数据，包含所有和未分类，不走缓存
    router.post('/getCateFilter', function () {
        
    });

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
    
    // TODO: 修改文章
    router.get('/editArticle/:id', function () {
        
    });

    // TODO: 删除文章
    router.post('/deleteArticles', function () {
        
    });

    // TODO: 还原文章
    router.post('/undoArticle', function () {
        
    });


    // 评论管理页面
    router.get('/comments', admin.comments);

    // 留言管理页面
    router.get('/guestbook', admin.guestbook);

    // 关于管理页面
    router.get('/aboutmanage', admin.aboutmanage);

    // TODO: 缓存管理页面
    router.get('/cachemanage', function () {

    });

    // TODO: 异常管理页面
    router.get('/exception', function () {

    });

    // TODO: 获取异常数据
    router.post('/getExceptions', function () {

    });

    // TODO: 系统设置页面
    router.get('/settings', function () {

    });

    // TODO: 保存系统设置
    router.post('/saveSettings', function () {

    });

    // TODO: 保存关于数据
    router.post('/saveAbout', function () {
        
    });

    // 上传图片
    router.post('/uploadimg', admin.uploadImg);

    // TODO: 根据缓存key获取缓存
    router.post('/getcache', function () {
        
    });


};