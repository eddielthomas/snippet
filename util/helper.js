const fs = require('fs');

const checkForFile = (
    fileName,
    callback
) => {
    fs.access(fileName, function (exists) {
        if (!exists) {
            callback();
        } else {
            fs.writeFile(fileName, { flag: 'wx' }, function (err, data) {
                callback();
            })
        }
    });
};

const readFile = (
    callback,
    returnJson = false,
    filePath = "",
    encoding = 'utf8'
) => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            throw err;
        }

        callback(returnJson ? JSON.parse(data) : data);
    });
};
const writeFile = (
    fileData,
    callback,
    filePath = "",
    encoding = 'utf8'
) => {
    fs.writeFile(filePath, fileData, encoding, err => {
        if (err) {
            throw err;
        }

        callback();
    });
};

const getExpireTime = (
    expires_in
) => {
    var nowTime = new Date(Date.now());
    nowTime.setSeconds( nowTime.getSeconds() + expires_in );
    return nowTime.toISOString();
}
const compareDateWithNow = (
    expires_in
) => {
    var nowTime = new Date(Date.now());
    var expireTime = new Date(expires_in);
    var seconds = (expireTime.getTime() - nowTime.getTime());
    return seconds>0?true: false;
}
module.exports = { checkForFile, readFile, writeFile, getExpireTime, compareDateWithNow }