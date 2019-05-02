import $ from "jquery";
import axios from "axios";
import Cookies from "js-cookie";
import { isFunction, log, fmtde } from "./fns";

// 各浏览器支持的 localStorage 和 sessionStorage 容量上限不同
const keep = window.localStorage || window.sessionStorage;
export const clsStore = (...args) => keep && keep.clear(...args);
export const getStore = (...args) => keep && keep.getItem(...args);
export const setStore = (...args) => keep && keep.setItem(...args);
export const delStore = (...args) => keep && keep.removeItem(...args);

// 单个 cookie 保存的数据不能超过 4KB
export const getCookie = (...args) => Cookies.get(...args);
export const setCookie = (...args) => Cookies.set(...args);
export const delCookie = (...args) => Cookies.remove(...args);

export const AUTH_TOKEN_KEY = "x-auth-token";
export const XSRF_TOKEN_KEY = "x-xsrf-token";
export const AUTH_KEY = "Authorization";
export const CONTENT_TYPE = {
	KEY: "Content-Type",
	XML: "text/xml; charset=utf-8",
	HTML: "text/html; charset=utf-8",
	TEXT: "text/plain; charset=utf-8",
	JSON: "application/json; charset=utf-8",
	FORM: "multipart/form-data; charset=utf-8",
	URLS: "application/x-www-form-urlencoded; charset=utf-8",
};
export const ACCEPT_ENCODING = {
	KEY: "Accept-Encoding",
	VAL: "br, gzip, deflate, compress, identity, *",
	// https://qgy18.com/request-compress 压缩 POST 请求数据
};
export const ERR_HANDLE = (data, status, statusText) => {
	const isOk = [200, 304].includes(status);
	const error = isOk ? data && data.error : data;
	const { code, abbr, view, desc,
		message = view, stack = desc } = error || {};
	const intro = code && abbr ? `[REST]${code} ${abbr}`
		: `[HTTP]${status} ${statusText}`;
	return error ? { intro, message, stack } : null;
};
// async cache method
const ASYNC_CACHE = { async: {}, cache: {} };
export const delCache = key => {
	const { async, cache } = ASYNC_CACHE;
	if (key) {
		delete async[key];
		delete cache[key];
	} else {
		ASYNC_CACHE.async = {};
		ASYNC_CACHE.cache = {};
	}
};
export const getCache = (key, fn) => {
	const { async, cache } = ASYNC_CACHE;
	if (key in cache) {
		return Promise.resolve(cache[key]);
	} else if (!async[key]) {
		async[key] = Promise.resolve(
			isFunction(fn) ? fn() : fn);
	}
	async[key].then(v => (cache[key] = v))
		.then(_ => delete async[key])
		.catch(_ => delete async[key]);
	return async[key];
};
// async lock method
const ASYNC_LOCKS = {};
export const initLock = key => {
	if (key != null && String(key)) {
		if (ASYNC_LOCKS[key]) { return true; }
		ASYNC_LOCKS[key] = true;
	}
};
export const undoLock = key => {
	if (key != null && String(key)) {
		ASYNC_LOCKS[key] = false;
	}
};
// meet async method
const ASYNC_MEETS = { promises: {}, resolves: {} };
export const meet = key => {
	const { promises, resolves } = ASYNC_MEETS;
	if (!promises[key] || !resolves[key]) {
		promises[key] = new Promise(
			resolve => (resolves[key] = resolve)
		);
	}
	return promises[key];
};

// jquery 常用请求封装 详细见file/my/heaven.js
export const $get = // data 为请求参数
	(url, data, type = "GET", dataType = "JSON") =>
		$.ajax({
			url, data, type, dataType,
			contentType: CONTENT_TYPE.URLS,
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
		const { responseText, status, statusText,
			responseJSON: data = responseText } = xhr;
		const err = check(data, status, statusText);
		if (err) { // eslint-disable-next-line
			throw { ...err, data, xhr };
		}
		resolve((data || {}).data || data);
	}));
};
export const jq = config => {
	const { key, ...req } = config || {};
	const result = fmtde(jqCheck($.ajax(req)));
	if (key) {
		const {
			promises: { [key]: ps },
			resolves: { [key]: rs },
		} = ASYNC_MEETS;
		ps && isFunction(rs) && rs(result);
		// 清除旧的meet等待async的resolve方法
		delete ASYNC_MEETS.resolves[key];
	}
	return result;
};

// 创建 axios 请求实例
export const service = axios.create({
	validateStatus: _status => true,
	baseURL: "/rest",
	timeout: 0,
});
/* axios 常用请求封装
https://github.com/axios/axios#request-method-aliases
service.get/delete/head/options(url, { params, headers });
service.post/put/patch(url, data, { params, headers });
下载二进制文件增加参数 {responseType:"blob"} jquery 不支持此方法
service.defaults.headers.get[CONTENT_TYPE.KEY] = CONTENT_TYPE.URLS;
service.defaults.headers.put[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.post[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.delete[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.common[AUTH_TOKEN_KEY] = AUTH_KEY;
*/
service.interceptors.request.use(
	// request 拦截器
	config => {
		// 在发送请求时执行函数, headers 携带 token, 请根据实际情况自行修改
		config.headers[AUTH_TOKEN_KEY] = AUTH_KEY;
		return config;
	},
	error => {
		log("service.interceptors.request.error", error);
		// 在 Promise 中 throw error 相当于 Promise.reject(error)
		throw error;
	}
);
service.interceptors.response.use(
	// respone 拦截器
	response => {
		// validateStatus 函数判 true 时响应处理函数, 返回值相当于 Promise.resolve 处理的结果
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
	error => {
		// validateStatus 函数判 false 时响应处理函数, 返回值相当于 Promise.reject 处理的结果
		log("service.interceptors.response.error", error);
		/* error = {
			message: "", // `message` 给服务器发送请求的响应错误标题
			response: {}, // `headers` 给服务器发送请求的响应信息
			request: {}, // `request` 给服务器发送请求的请求信息
			config: {}, // `config` 给服务器发送请求的配置信息
		}; */
		throw error;
	}
);
export const axCheck = (xhr, check) => {
	// xhr 为 axios 的 promise 对象
	isFunction(check) || (check = ERR_HANDLE);
	return xhr.then(response => {
		const { data, status, statusText } = response || {};
		const err = check(data, status, statusText);
		if (err) { // eslint-disable-next-line
			throw { ...err, response };
		}
		return (data || {}).data || data;
	});
};
export const ax = config => {
	const { key, ...req } = config || {};
	const result = fmtde(axCheck(service.request(req)));
	if (key) {
		const {
			promises: { [key]: ps },
			resolves: { [key]: rs },
		} = ASYNC_MEETS;
		ps && isFunction(rs) && rs(result);
		// 清除旧的meet等待async的resolve方法
		delete ASYNC_MEETS.resolves[key];
	}
	return result;
};

export const downLink = (link, name) => {
	const a = document.createElement("a");
	a.style.display = "none";
	a.target = "_blank";
	a.download = name;
	a.href = link;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};
export const downBolb = (blob, name) => {
	const { msSaveBlob } = window.navigator;
	if (msSaveBlob) { // IE10+ 下载
		return msSaveBlob(blob, name);
	}
	const url = URL.createObjectURL(blob);
	downLink(url, name);
	URL.revokeObjectURL(url);
};