const fs = require('fs');


/**
 * 读取配置文件
 * @param filePath：文件路径
 * @param key：要读取的配置项key
 * @param callback：回调函数
 */
exports.getConfig = function (filePath, key, callback) {
    if (typeof key === 'function') {
        callback = key;
        key = undefined;
    }

    fs.readFile(filePath, 'utf8', function (err, file) {
        if (err) {
            console.log('读取文件%s出错: ' + err, filePath);
            return callback(err);
        }
        var data = JSON.parse(file);
        if (typeof key === 'string') {
            data = data[key];
        }
        return callback(null, data);
    });
};

exports.jsonQuery = function (jsonArray, conditions) {
    var i = 0;
    var len = jsonArray.length;
    var json;
    var condition;
    var flag;
    for (; i < len; i++) {
        flag = true;
        json = jsonArray[i];
        for (condition in conditions) {
            if (json[condition] != conditions[condition]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            return json;
        }
    }
};