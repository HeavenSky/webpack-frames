import { gcs, create, loadJs } from "./dom";
import { getCache } from "./service";

// 单行文字自适应大小
export const fitText = (target, text, rdx = 3) => {
	const span = create("span", text, { parent: target });
	span.style.cssText = "border:0;margin:0;padding:0;width:auto;min-width:auto;max-width:none;overflow:visible;position:absolute;visibility:hidden;white-space:nowrap;font:inherit;columns:inherit;transform:inherit;text-indent:inherit;word-spacing:inherit;letter-spacing:inherit;text-transform:inherit;";
	const limit = parseFloat(gcs(target).width) || 0;
	const width = parseFloat(gcs(span).width) || 0;
	const sfs = parseFloat(gcs(span).fontSize) || 0;
	target.innerText = text;
	if (limit && width && sfs) {
		rdx = rdx > 0 && rdx < 9 ? rdx >> 0 : 0;
		const tfs = (sfs * limit / width).toFixed(rdx);
		target.style.fontSize = tfs + "px";
	}
};

// 用来手动加载excel导出依赖的js
export const xlsxOk = _ => getCache("xlsxOk", _ =>
	Promise.all([ // npmh highlight.js;npmh file-saver;
		"https://cdn.bootcss.com/xlsx/0.14.2/xlsx.full.min.js",
		"https://cdn.bootcss.com/FileSaver.js/1.3.8/FileSaver.min.js",
	].map(loadJs)));
export const rows2list = (rows, keys) => {
	// rows:列表数组 keys:列名数组
	keys || (keys = Object.keys(rows[0]));
	return rows.map(v => keys.map(k => v[k]));
};
export const list2html = (list, id, editable) => {
	// list:二维数组[[1,2],[2,4]] 返回table的html字符串
	const { utils } = window.XLSX;
	const sheet = utils.aoa_to_sheet(list);
	return utils.sheet_to_html(sheet, { id, editable });
};
export const html2file = (html, opts) => {
	// bookType 和 name 后缀对应关系
	const type2name = {
		biff8: ".xls",
		xlsx: ".xlsx",
		xlsb: ".xlsb",
		fods: ".fods",
		ods: ".ods",
		csv: ".csv",
	};
	const { writeFile, write, utils } = window.XLSX;
	const { onlydata, sheet = "sheet", bookType = "xlsx",
		name = sheet + type2name[bookType] } = opts || {};
	const book = utils.table_to_book(html, { sheet });
	return !onlydata ? writeFile(book, name) : write(
		book, { bookType, bookSST: true, type: "base64" });
};
export const downBySwf = (html, opts, btn) => {
	// TODO SOME UI, 监测当前低版本浏览器
	opts = Object.assign(opts, { onlydata: true });
	window.Downloadify.create(btn, {
		width: 80,
		height: 20,
		append: false,
		transparent: false,
		dataType: "base64",
		filename: opts.name,
		swf: "downloadify.swf",
		downloadImage: "download.png",
		data: _ => html2file(html, opts),
		onComplete: _ => "文件保存成功!",
		onCancel: _ => "文件保存取消!",
		onError: _ => "文件保存错误!",
	});
};