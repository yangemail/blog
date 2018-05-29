const User = require('mongoose').model('User');
const passport = require('passport');
var Cookies = require('cookie-parser');

function getErrorMessage(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

// validate user is admin?
exports.validateAdmin = function (req, res, next) {
    req.cookies = new Cookies(req, res);

    // 解析登陆用户的cookie信息
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            // 获取当前登陆用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
        } catch (e) {
            next();
        }
    } else {
        next();
    }
}