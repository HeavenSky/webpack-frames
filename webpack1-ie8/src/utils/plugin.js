import { loadJs } from "./dom";

// npmh xlsx;npmh file-saver; 手动加载excel依赖的xlsx
export const loadXlsx = () => Promise.all([
	"xlsx/dist/xlsx.full.min.js",
	"file-saver/dist/FileSaver.min.js",
].map(v => loadJs("https://cdn.jsdelivr.net/npm/" + v)));
export const list2html = (list, id, editable) => {
	const { utils } = window.XLSX;
	const sheet = utils.aoa_to_sheet(list);
	return utils.sheet_to_html(sheet, { id, editable });
}; // list:二维数组[[1,2],[2,4]] 返回table的html字符串
export const html2file = (html, opts) => {
	const type2name = {
		biff8: ".xls", fods: ".fods", ods: ".ods",
		xlsx: ".xlsx", xlsb: ".xlsb", csv: ".csv",
	}; // bookType 和 name 后缀对应关系
	const { writeFile, write, utils } = window.XLSX;
	const { onlydata, sheet = "sheet", bookType = "xlsx",
		name = sheet + type2name[bookType] } = opts || {};
	const book = utils.table_to_book(html, { sheet });
	return !onlydata ? writeFile(book, name) : write(
		book, { bookType, bookSST: true, type: "base64" });
};
export const downBySwf = (html, opts, btn) => {
	// TODO SOME UI 监测当前低版本浏览器
	opts = { ...opts, onlydata: true };
	window.Downloadify.create(btn, {
		width: 80,
		height: 20,
		append: false,
		transparent: false,
		dataType: "base64",
		filename: opts.name,
		swf: "downloadify.swf",
		downloadImage: "download.png",
		data: () => html2file(html, opts),
		onComplete: () => "文件保存成功!",
		onCancel: () => "文件保存取消!",
		onError: () => "文件保存错误!",
	});
};