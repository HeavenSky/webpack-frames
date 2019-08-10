const shell = require("shelljs");
const { buildFolder, LIB } = require("./opt.self");
const { WK, isArray, dir, fmt, dmt } = require("./basic");

const build = dir(buildFolder);
shell.rm("-rf", build); shell.mkdir("-p", build);
const fm = (chunks, name) => {
	isArray(chunks) || (chunks = [chunks]);
	const fps = chunks.map(v => {
		try {
			let fv = String(fmt(v) || "");
			if (/^\.\//.test(fv)) { fv = dir(fv); }
			return require.resolve(fv);
		} catch (_error) { return ""; }
	}).filter(Boolean);
	shell.cat(...fps).to(dir(build, name));
}; // 执行文本拼接
dmt.keys(LIB).forEach(name => fm(LIB[name], name));
const m = "react-hot-loader"; // RHL在React0处理不兼容临时方案
const p = dir(`node_modules/${m}/dist/${m}.development.js`);
WK < 2 && shell.test("-f", p) && shell.sed("-i",
	/stack\.children\./g, "(stack.children||[]).", p);