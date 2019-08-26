import $ from "jquery";
import axios from "axios";
import Cookies from "js-cookie";
import { isFunction, dir, tryEXEC } from "./fns";

const handleStore = key => (...args) => // sessionStorage
	tryEXEC(() => window.localStorage[key](...args));
export const clsStore = handleStore("clear");
export const getStore = handleStore("getItem");
export const setStore = handleStore("setItem");
export const delStore = handleStore("removeItem");
export const { get: getCookie, set: setCookie,
	remove: delCookie } = Cookies; // 单个cookie数据最大4kb
// 跨域请求headers 压缩数据响应headers
export const AUTH_KEY = "Authorization";
export const AUTH_TOKEN_KEY = "x-auth-token";
export const XSRF_TOKEN_KEY = "x-xsrf-token";
export const CONTENT_TYPE = {
	KEY: "Content-Type",
	XML: "text/xml; charset=utf-8",
	HTML: "text/html; charset=utf-8",
	TEXT: "text/plain; charset=utf-8",
	JSON: "application/json; charset=utf-8",
	FORM: "multipart/form-data; charset=utf-8",
	URL: "application/x-www-form-urlencoded; charset=utf-8",
};
export const ACCEPT_ENCODING = {
	KEY: "Accept-Encoding",
	VAL: "br, gzip, deflate, compress, identity, *",
}; // https://qgy18.com/request-compress 压缩 POST 数据
export const ERR_HANDLE = (data, status, statusText) => {
	// code abbr view desc error stack message exception
	let { error, message, exception } = data || {};
	const { code, abbr, view, desc } = error || {};
	if (status === 200 && !error) { return; }
	if (!exception) { exception = void 0; }
	if (error === message) { error = void 0; }
	if (message === statusText) { message = void 0; }
	let intro = `[HTTP]${status} ${statusText}`;
	if (code && abbr) {
		intro = `[SELF]${code} ${abbr}`;
		return { intro, message: view, stack: desc };
	}
	return { intro, message, stack: exception };
};
const RF = v => v; // response数据格式化
const PF = v => v; // promise数据格式化
// jquery 常用请求封装 详细见file/my/heaven.js
export const $get = // data 为请求参数
	(url, data, type = "GET", dataType = "JSON") =>
		$.ajax({
			url, data, type, dataType,
			contentType: CONTENT_TYPE.URL,
		});
export const $post = // data 为 json 对象
	(url, data, type = "POST", dataType = "JSON") =>
		$.ajax({
			url, type, dataType,
			data: JSON.stringify(data),
			contentType: CONTENT_TYPE.JSON,
		});
export const $form = // data 为 FormData 对象
	(url, data, type = "POST", dataType = "JSON") =>
		$.ajax({
			url, data, type, dataType,
			processData: false,
			contentType: false,
		});
export const jqCheck = (xhr, check) => {
	// xhr 为 jquery 的 deferred 对象
	isFunction(check) || (check = ERR_HANDLE);
	return new Promise(resolve => xhr.always(() => {
		const { status, statusText, responseText,
			responseJSON: data = responseText } = xhr;
		const err = check(data, status, statusText);
		// eslint-disable-next-line no-throw-literal
		if (err) { throw { ...err, data, res: xhr }; }
		resolve(RF(data));
	}));
};
export const jq = (config, check) =>
	PF(jqCheck($.ajax(config), check));
/* *************** 开始 axios service 实例 *************** */
export const service = axios.create({
	validateStatus: Boolean, baseURL: "/rest", timeout: 0,
});
/* axios 常用请求封装
service.get/delete/head/options(url, { params, headers });
service.post/put/patch(url, data, { params, headers });
下载二进制文件增加参数 {responseType:"blob"} jquery 不支持此方法
service.defaults.headers.get[CONTENT_TYPE.KEY] = CONTENT_TYPE.URL;
service.defaults.headers.put[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.post[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.delete[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.common[AUTH_TOKEN_KEY] = AUTH_KEY;
https://github.com/axios/axios#request-method-aliases */
service.interceptors.request.use( // request 拦截器
	config => {
		config.headers[AUTH_TOKEN_KEY] = AUTH_KEY;
		return config;
	}, // 在发送请求时执行函数,可用来给 headers 携带 token
	error => {
		dir.error("service.request.error", error);
		throw error;
	}
);
service.interceptors.response.use( // respone 拦截器
	response => { // validateStatus 返回 true 时执行
		/* response = {
			data: {} || "", // `data` 给服务器发送请求的响应数据信息
			status: 200, // `status` 给服务器发送请求的响应 HTTP 状态码
			statusText: "OK", // `statusText` 给服务器发送请求的响应 HTTP 状态信息
			headers: {}, // `headers` 给服务器发送请求的响应 HTTP 响应头
			config: {}, // `config` 给服务器发送请求的配置信息
			request: {}, // `request` 给服务器发送请求的请求信息
		}; */
		const { headers } = response || {};
		const token = (headers || {})[AUTH_TOKEN_KEY];
		setStore(AUTH_TOKEN_KEY, token);
		return response;
	},
	error => { // validateStatus 返回 false 时执行
		/* error = {
			message: "", // `message` 给服务器发送请求的响应错误标题
			response: {}, // `headers` 给服务器发送请求的响应信息
			request: {}, // `request` 给服务器发送请求的请求信息
			config: {}, // `config` 给服务器发送请求的配置信息
		}; */
		dir.error("service.response.error", error);
		throw error;
	}
);
/* *************** 结束 axios service 实例 *************** */
export const axCheck = (xhr, check) => {
	// xhr 为 axios 的 promise 对象
	isFunction(check) || (check = ERR_HANDLE);
	return xhr.then(res => {
		const { data, status, statusText } = res || {};
		const err = check(data, status, statusText);
		// eslint-disable-next-line no-throw-literal
		if (err) { throw { ...err, data, res }; }
		return RF(data);
	});
};
export const ax = (config, check) =>
	PF(axCheck(service.request(config), check));
export const downLink = (link, name) => {
	const a = document.createElement("a"); a.href = link;
	a.style.display = "none"; a.target = "_blank";
	a.download = name; document.body.appendChild(a);
	a.click(); document.body.removeChild(a);
};
export const downBolb = (blob, name) => {
	const { msSaveBlob } = window.navigator;
	if (msSaveBlob) { return msSaveBlob(blob, name); }
	const url = URL.createObjectURL(blob);
	downLink(url, name); URL.revokeObjectURL(url);
}; // IE10+ 用 msSaveBlob 下载