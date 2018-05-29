const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // 用户名
    username: {
        type: String,
        index: true,
        unique: true,
        required: true,
        trim: true
    },
    // 密码
    password: {
        type: String,
        required:true,
        validate: [
            function (password) {
                return password.length >= 6;
            },
            'Password should be at least 6 letters'
        ]
    },
    // 是否是管理员
    isAdmin: {
        type: Boolean,
        default: false
    }
});

mongoose.model('User', UserSchema);