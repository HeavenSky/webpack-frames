import $ from "jquery";
import axios from "axios";
import Cookies from "js-cookie";
import { log } from "./fns";

// 各浏览器支持的 localStorage 和 sessionStorage 容量上限不同
const keep = window.localStorage || window.sessionStorage;
export const clsStore = (...args) => keep && keep.clear(...args);
export const getStore = (...args) => keep && keep.getItem(...args);
export const setStore = (...args) => keep && keep.setItem(...args);
export const delStore = (...args) => keep && keep.removeItem(...args);

// 单个cookie保存的数据不能超过4kb
export const getCookie = (...args) => Cookies.get(...args);
export const setCookie = (...args) => Cookies.set(...args);
export const delCookie = (...args) => Cookies.remove(...args);

export const URL_METHOD = "get,delete,head,options".split(",");
export const ALL_METHOD = "get,delete,head,options,post,put,patch".split(",");
export const AUTH_TOKEN_KEY = "x-auth-token";
export const XSRF_TOKEN_KEY = "x-xsrf-token";
export const AUTH_KEY = "Authorization";
export const TYPE_KEY = "Content-Type";
export const CONTENT_TYPE = {
	URL: "application/x-www-form-urlencoded; charset=utf-8",
	FORM: "multipart/form-data; charset=utf-8",
	JSON: "application/json; charset=utf-8",
	HTML: "text/html; charset=utf-8",
	TXT: "text/plain; charset=utf-8",
	XML: "text/xml; charset=utf-8",
};

// jquery常用请求封装
export const $get =
	// data 为请求参数
	(url, data, type = "GET", dataType = "JSON") =>
		$.ajax({
			url, data, type, dataType,
			contentType: CONTENT_TYPE.URL,
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

// 创建axios请求实例
export const service = axios.create({
	validateStatus: status => true,
	baseURL: "/mock",
	timeout: 0,
});
/*
service.defaults.headers.get[TYPE_KEY] = CONTENT_TYPE.URL;
service.defaults.headers.put[TYPE_KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.post[TYPE_KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.delete[TYPE_KEY] = CONTENT_TYPE.JSON;
service.defaults.headers.common[AUTH_TOKEN_KEY] = AUTH_KEY;
*/
// request拦截器
service.interceptors.request.use(
	config => {
		// 在发送请求时执行函数,headers携带token,请根据实际情况自行修改
		config.headers[AUTH_TOKEN_KEY] = getStore(AUTH_TOKEN_KEY);
		return config;
	},
	error => {
		log.error("service.interceptors.request.error", error);
		// 在Promise中 throw error 相当于 Promise.reject(error)
		throw error;
	}
);
// respone拦截器
service.interceptors.response.use(
	response => {
		// validateStatus函数判true时响应处理函数,返回值相当于Promise.resolve处理的结果
		log("service.interceptors.response", response);
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
		log.error("service.interceptors.response.error", error);
		/* error = {
			message: "", // `message` 给服务器发送请求的响应错误标题
			response: {}, // `headers` 给服务器发送请求的响应信息
			request: {}, // `request` 给服务器发送请求的请求信息
			config: {}, // `config` 给服务器发送请求的配置信息
		};*/
		throw error;
	}
);
// axios常用请求封装 https://github.com/axios/axios#request-method-aliases
// service.get/delete/head/options(url, { params, headers });
// service.post/put/patch(url, data, { params, headers });
export const request = (key, check) => {
	ALL_METHOD.includes(key) || (key = "get");
	if (typeof check !== "function") {
		check = (status, data) => [200, 301].includes(status);
	}
	return (url, data, config) => {
		const cfg = { url, method: key };
		if (URL_METHOD.includes(key)) {
			cfg.params = data;
		} else if (data) {
			cfg.data = data;
		}
		Object.assign(cfg, config);
		return service.request(cfg).then(response => {
			const { data, status, statusText } = response || {};
			const message = `${status} ${statusText}`;
			if (check(status, data)) {
				return data;
			} else {
				const error = { message, response };
				throw error;
			}
		});
	};
};
export const save = (data, filename) => {
	const blob = new Blob([data]);
	if (navigator.msSaveBlob) {
		// IE10+下载
		navigator.msSaveBlob(blob, filename);
	} else {
		const a = document.createElement("a");
		a.style.display = "none";
		a.download = filename;
		const url = URL.createObjectURL(blob);
		a.href = url;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		// 释放URL对象
		URL.revokeObjectURL(url);
	}
	return data;
};
export const download = (filename, key, url, data, config) => {
	const cfg = { url, responseType: "blob" };
	Object.assign(cfg, config);
	return request(key)(0, data, cfg)
		.then(db => save(db, filename));
};

// ReactRouter权限检查 route=>Component||Promise.resolve(Component)
const permission = route => {
	const auth = true;
	if (auth) {
		// 权限检查通过 显示对应组件
		return route.component;
	} else {
		// 无权限访问 显示403页面
		const Page403 = props => 403;
		return Page403;
	}
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
router.beforeEach(
	(to, from, next) => {
		nprogress.start();
		if (permission) {
			next();
		} else {
			next("/");
			nprogress.done();
		}
	}
);
router.afterEach(
	(to, from) => nprogress.done()
);