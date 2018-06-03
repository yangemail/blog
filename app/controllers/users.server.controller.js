const User = require('mongoose').model('User');
const passport = require('passport');

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

// Render
exports.renderSignin = function (req, res, next) {
    if (!req.user) {
        res.render('signin', {
            title: 'Sign-in Form',
            message: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

// Render
exports.renderSignup = function (req, res, next) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign-up Form',
            message: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};

exports.signup = function (req, res, next) {
    if (!req.user) {
        const user = new User(req.body);
        user.provider = 'local';

        user.save(function (err) {
            if (err) {
                const messsage = getErrorMessage(err);

                req.flash('error', messsage);
                return res.redirect('/signup');
            }
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};

exports.signout = function (req, res) {
    // req.logout();
    // res.redirect('/');
};

exports.create = function (req, res, next) {
    console.log(req);

    const user = new User(req.body);

    user.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(user);
        }
    });
};

exports.list = function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(users);
        }
    });
};

exports.listUsernameEmail = function (req, res, next) {
    User.find({}, "username email", function (err, users) {
        if (err) {
            next(err);
        } else {
            res.status(200).json(users);
        }
    });
};

exports.listUsernameEmailLimited = function (req, res, next) {
    User.find({}, "username email", {
        skip: 10,
        limit: 10
    }, function (err, users) {
        if (err) {
            next(err);
        } else {
            res.status(200).json(users);
        }
    });
};

exports.read = function (req, res) {
    res.json(req.user);
};

exports.userByID = function (req, res, next) {
    User.findOne({
        _id: id
    }, function (err, user) {
        if (err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

exports.update = function (req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, {
        // set the "new" option to "true", making sure that to receive the updated document.
        'new': true
    }, function (err, user) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(user);
        }
    });
};

exports.delete = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(req.user);
        }
    });
};

exports.findByUsername = function (req, res, next) {
    User.findOneByUsername('username', function (err, user) {
        if (err) {
            return next(err);
        } else {
            ;
        }
    });
};