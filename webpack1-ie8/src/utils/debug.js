const debug = (...x) => (...y) => debug(...x, ...y);
module.exports = debug; // 防止require引入报错