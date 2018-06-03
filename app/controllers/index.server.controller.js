const path = require('path');
const async = require('async');


exports.render = function (req, res, next) {

    // if (req.session.lastVisit) {
    //     console.log(req.session.lastVisit);
    // }
    //
    // req.session.lastVisit = new Date();

    res.render('index', {
        title: 'Hello World',
        userFullName: "Yang Zhang"
    });
};