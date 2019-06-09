const fs = require("fs");
const { isArray, WK, dir, dst, fmt } = require("./basic");
const { buildFolder, LIB } = require("./opt.self");
// fs.existsSync(buildPath) && fs.rmdirSync(buildPath);
const isValid = v => v && typeof v === "string";
const fm = (data, name) => {
	const list = isArray(data) ? data : [data];
	const content = list.map(v => {
		const fv = fmt(v);
		if (!isValid(fv)) { return ""; }
		const fp = /^\.\//.test(fv) ? "" : "node_modules";
		return fs.readFileSync(dir(fp, fv), "utf-8");
	}).join("\n");
	const buildPath = dir(buildFolder);
	fs.existsSync(buildPath) || fs.mkdirSync(buildPath);
	const filePath = dir(buildFolder, name);
	fs.writeFileSync(filePath, content, "utf-8");
};
const m = "react-hot-loader"; // react@0 不兼容临时方案
const p = dir(`node_modules/${m}/dist/${m}.development.js`);
if (WK === 1 && fs.existsSync(p)) {
	let str = fs.readFileSync(p, "utf-8");
	str = str.replace(/stack.children.push/g,
		"(stack.children||[]).push");
	fs.writeFileSync(p, str, "utf-8");
} // 执行文本拼接
dst.every(LIB, name => fm(LIB[name], name));