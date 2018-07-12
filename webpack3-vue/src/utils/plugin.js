const DATA_MAP = {};
const DATA_AJAX = {};
export const cacheData = (key, fn) => {
	const data = DATA_MAP[key];
	if (data) {
		return Promise.resolve(data);
	} else {
		let ajax = DATA_AJAX[key];
		if (!ajax) {
			ajax = fn();
			DATA_AJAX[key] = ajax;
		}
		const cb = () => delete DATA_AJAX[key];
		ajax.then(cb, cb); // eslint-disable-line
		return ajax.then(
			v => (DATA_MAP[key] = v.data)
		);
	}
};

export const loadDom = (tag, attr, target) =>
	new Promise( // eslint-disable-line
		(resolve, reject) => {
			const dom = document.createElement(tag);
			dom.onload = resolve;
			dom.onerror = reject;
			dom.style.display = "none";
			Object.assign(dom, attr);
			(target || document.body).appendChild(dom);
			const { src, href } = attr || {};
			const isSrc = src && "onload" in dom;
			const isCss = href && /^link$/i.test(tag);
			if (!isSrc && !isCss) {
				resolve(dom);
			}
		}
	);
export const loadImg = src => loadDom("img", { src });
export const loadCss = href => loadDom("link", { rel: "stylesheet", href });
export const loadJs = src => loadDom("script", { type: "text/javascript", src });

const loadXlsx = () =>
	Promise.all([
		"https://cdn.bootcss.com/xlsx/0.12.12/xlsx.full.min.js",
		"https://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js",
	].map(loadJs)).then(v => true);
export const readyXlsx = () => cacheData("XLSX", loadXlsx);

export const list2Table = (list, id, editable) => {
	// list 是一个二维数组 [[1,2],[2,4]]; 返回 html 字符串
	const { XLSX } = window;
	if (XLSX) {
		const ws = XLSX.utils.aoa_to_sheet(list);
		return XLSX.utils.sheet_to_html(ws, { id, editable });
	}
};
export const table2Sheet = (eleTable, opts) => {
	// bookType 和 filename 后缀对应关系
	// biff8->*.xls; csv->*.csv; fods->*.fods; ods->*.ods; xlsb->*.xlsb; xlsx->*.xlsx;
	const { XLSX } = window;
	if (XLSX) {
		const {
			sheet = "sheet",
			bookType = "xlsx",
			filename = "file.xlsx",
			onlydata,
		} = opts || {};
		const wb = XLSX.utils.table_to_book(eleTable, { sheet });
		return !onlydata ? XLSX.writeFile(wb, filename)
			: XLSX.write(wb, { bookType, bookSST: true, type: "base64" });
	}
};
export const downloadSheet = (eleTable, opts, btn) => {
	const { XLSX, Downloadify } = window;
	if (XLSX && Downloadify) {
		// 监测当前低版本浏览器, 做一些UI的变化
		opts = Object.assign(
			{ filename: "file.xlsx" },
			opts,
			{ onlydata: true }
		);
		const { filename } = opts;
		Downloadify.create(btn, {
			downloadImage: "download.png",
			swf: "downloadify.swf",
			width: 80,
			height: 20,
			append: false,
			transparent: false,
			dataType: "base64",
			filename,
			data: () => table2Sheet(eleTable, opts),
			onComplete: () => "文件保存成功!",
			onCancel: () => "您取消了文件保存!",
			onError: () => "您必须在文件内容中放置某些内容, 否则将无法保存任何内容!",
		});
	}
};
export const rows2Table = (rows, cols) => {
	// rows 为行数据数组 cols 为列设置{key,title}
	cols || (cols = Object.keys(rows[0]).map(
		key => ({ key, title: key })
	));
	const list = cols.map(col => col.title);
	rows.forEach(row => list.push(
		cols.map(({ key }) => row[key])
	));
	const div = document.createElement("div");
	div.style.display = "none";
	document.body.append(div);
	const id = "rows_table_" + +new Date();
	div.innerHTML = list2Table(list, id);
	return div.getElementsByTagName("table")[0];
};