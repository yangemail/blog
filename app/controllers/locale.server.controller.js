
exports.localelang = function (req, res, next) {
    if (req.params.lang) {
        // Set-Cookie for language/locale
        res.cookies('locale', req.params.lang, {maxAge: 900000, httpOnly: true});
    }
    res.redirect('/');
};