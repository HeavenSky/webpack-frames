const debug = (...x) => (...y) => debug(...x, ...y);
module.exports = debug;