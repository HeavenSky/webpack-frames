import $ from "jquery";
import axios from "axios";
import Cookies from "js-cookie";
import { isFunction, tryEXEC } from "./fns";

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
export const AUTH_TOKEN_KEY = "X-AUTH-TOKEN";
export const CSRF_TOKEN_KEY = "X-CSRF-TOKEN";
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
/* axios 常用请求封装, request 拦截器, response 拦截器
https://github.com/axios/axios#request-method-aliases
service.post/put/patch(url, data, { params, headers });
service.get/delete/head/options(url, { params, headers });
下载二进制文件增加参数 {responseType:"blob"} jquery 不支持此方法
const { KEY, URL, JSON } = CONTENT_TYPE;
service.defaults.headers.get[KEY] = URL;
service.defaults.headers.put[KEY] = JSON;
service.defaults.headers.post[KEY] = JSON;
service.defaults.headers.delete[KEY] = JSON;
service.defaults.headers.common[AUTH_KEY] = ""; */
/* *************** 开始 axios service 实例 *************** */
export const service = axios.create({
	validateStatus: Boolean, baseURL: "/rest", timeout: 0,
});
service.interceptors.request.use(
	config => config, // 修改请求发送的配置信息,如headers
	error => error // 请求发送的异常错误信息
);
service.interceptors.response.use(
	response => response, // validateStatus 返回真值
	/* response = {
		data: {} || "", // `data` 请求返回的响应数据
		status: 200, // `status` 请求响应的状态码
		statusText: "OK", // `statusText` 请求响应的状态信息
		headers: {}, // `headers` 请求响应的信息头
		config: {}, // `config` 请求发送的配置信息
		request: {}, // `request` 请求发送的数据信息
	}; */
	error => error // validateStatus 返回假值
	/* error = {
		message: "", // `message` 请求响应的错误标题
		config: {}, // `config` 请求发送的配置信息
		request: {}, // `request` 请求发送的数据信息
		response: {}, // `response` 请求返回的响应数据
	}; */
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