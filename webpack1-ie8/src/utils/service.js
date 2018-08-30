import $ from "jquery";
import axios from "axios";
import Cookies from "js-cookie";
import { log } from "./fns";

// 各浏览器支持的 localStorage 和 sessionStorage 容量上限不同
const keep = window.localStorage && window.sessionStorage;
export const clsStore = (...args) => keep && keep.clear(...args);
export const getStore = (...args) => keep && keep.getItem(...args);
export const setStore = (...args) => keep && keep.setItem(...args);
export const delStore = (...args) => keep && keep.removeItem(...args);

// 单个cookie保存的数据不能超过4kb
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
	// https://qgy18.com/request-compress 压缩POST请求数据
};
export const ERR_HANDLE = (data, status, statusText) => {
	const isOk = /^(2\d+|301)$/.test(status);
	if (isOk) {
		const { error } = data || {};
		return error ? error.message || "error" : "";
	} else {
		return `${status} ${statusText}`;
	}
};

// jquery常用请求封装
export const $get =
	// data 为请求参数
	(url, data, type = "GET", dataType = "JSON") =>
		$.ajax({
			url, data, type, dataType,
			contentType: CONTENT_TYPE.URLS,
		});
export const $post =
	// data 为json对象
	(url, data, type = "POST", dataType = "JSON") =>
		$.ajax({
			url, type, dataType,
			data: JSON.stringify(data),
			contentType: CONTENT_TYPE.JSON,
		});
export const $form =
	// data 为FormData对象
	(url, data, type = "POST", dataType = "JSON") =>
		$.ajax({
			url, data, type, dataType,
			processData: false,
			contentType: false,
		});
export const $promise = (jq, check) => {
	// jq 为jquery的Deferred对象
	typeof check === "function" || (check = ERR_HANDLE);
	const fn = (xhr, resolve) => {
		const { responseText, status, statusText,
			responseJSON = responseText } = xhr;
		const data = responseJSON;
		const message = check(data, status, statusText);
		if (message) {
			// eslint-disable-next-line
			throw { message, xhr };
		}
		resolve(data);
	};
	return new Promise(resolve => jq.done(
		(data, status, xhr) => fn(xhr, resolve)
	).fail(
		(xhr, status, error) => fn(xhr, resolve)
	));
};
// 创建axios请求实例
export const service = axios.create({
	validateStatus: status => true,
	baseURL: "/mock",
	timeout: 0,
});
/*
service.defaults.headers.get[CONTENT_TYPE.KEY] = CONTENT_TYPE.URLS;
service.defaults.headers.put[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.post[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.delete[CONTENT_TYPE.KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.common[AUTH_TOKEN_KEY] = AUTH_KEY;
*/
// request拦截器
service.interceptors.request.use(
	config => {
		// 在发送请求时执行函数,headers携带token,请根据实际情况自行修改
		config.headers[AUTH_TOKEN_KEY] = AUTH_KEY;
		return config;
	},
	error => {
		log("service.interceptors.request.error", error);
		// 在Promise中 throw error 相当于 Promise.reject(error)
		throw error;
	}
);
// respone拦截器
service.interceptors.response.use(
	response => {
		// validateStatus函数判true时响应处理函数,返回值相当于Promise.resolve处理的结果
		/* response = {
			data: {} || "", // `data` 给服务器发送请求的响应数据信息
			status: 200, // `status` 给服务器发送请求的响应 HTTP 状态码
			statusText: "OK", // `statusText` 给服务器发送请求的响应 HTTP 状态信息
			headers: {}, // `headers` 给服务器发送请求的响应 HTTP 响应头
			config: {}, // `config` 给服务器发送请求的配置信息
			request: {}, // `request` 给服务器发送请求的请求信息
		};*/
		const { headers } = response || {};
		const token = (headers || {})[AUTH_TOKEN_KEY];
		setStore(AUTH_TOKEN_KEY, token);
		return response;
	},
	error => {
		// validateStatus函数判false时响应处理函数,返回值相当于Promise.reject处理的结果
		log("service.interceptors.response.error", error);
		/* error = {
			message: "", // `message` 给服务器发送请求的响应错误标题
			response: {}, // `headers` 给服务器发送请求的响应信息
			request: {}, // `request` 给服务器发送请求的请求信息
			config: {}, // `config` 给服务器发送请求的配置信息
		};*/
		throw error;
	}
);
/* axios常用请求封装 https://github.com/axios/axios#request-method-aliases
service.get/delete/head/options(url, { params, headers });
service.post/put/patch(url, data, { params, headers });
下载二进制文件增加参数 {responseType:"blob"} jquery不支持此方法
*/
export const request = (key, check) => (...args) => {
	typeof service[key] === "function" || (key = "get");
	typeof check === "function" || (check = ERR_HANDLE);
	return service[key](...args).then(response => {
		const { data, status, statusText } = response || {};
		const message = check(data, status, statusText);
		if (message) {
			// eslint-disable-next-line
			throw { message, response };
		} else {
			return data;
		}
	});
};
export const save = (blob, name) => {
	if (navigator.msSaveBlob) { // IE10+下载
		navigator.msSaveBlob(blob, name);
	} else {
		const a = document.createElement("a");
		a.style.display = "none";
		a.download = name;
		const url = URL.createObjectURL(blob);
		a.href = url;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
};

// ReactRouter权限检查 route=>Component
const permission = route => {
	// 权限检查通过 显示对应组件
	const auth = true;
	// 无权限访问 显示403页面
	const Page403 = props => 403;
	return auth ? route.component : Page403;
};

// VueRouter路由控制
const router = {
	beforeEach() { },
	afterEach() { },
};
const nprogress = {
	start() { },
	done() { },
};
router.beforeEach((to, from, next) => {
	nprogress.start();
	if (permission) {
		next();
	} else {
		next("/");
		nprogress.done();
	}
});
router.afterEach((to, from) => nprogress.done());