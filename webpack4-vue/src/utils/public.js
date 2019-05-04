import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import signals from "signals";
import PubSub from "pubsub-js";
import Cookies from "js-cookie";
import nprogress from "nprogress";
import "moment/locale/zh-cn";
import "nprogress/nprogress.css";
// import "pace-less/themes/center-atom.less";
// http://github.hubspot.com/pace
// http://ricostacruz.com/nprogress
import "./public.less";
import { create, ready, clientInfo } from "./dom";
// global variable for debug
Object.assign(window, {
	axios, moment, numeral, signals,
	PubSub, Cookies, nprogress,
});
// ployfill console print
const log = window.console || { memory: {} };
(window.console = log) && [
	"debug", "error", "info", "log", "warn", "dir",
	"dirxml", "table", "trace", "group", "groupCollapsed",
	"groupEnd", "clear", "count", "assert", "markTimeline",
	"profile", "profileEnd", "timeline", "timelineEnd",
	"time", "timeEnd", "timeStamp", "context",
].forEach(v => log[v] || (log[v] = _ => null));
// compatible mobile retina hd and click event
ready.then(() => {
	const { html, head, body, dpr, fc, ua } = clientInfo;
	fc && fc.attach(body); // 兼容处理移动端点击事件
	html.style.fontSize = "13.333vw"; // 750视觉稿字体设置
	const name = "viewport"; // 移动端组件大多不支持rem
	let hd = dpr > 1 && /(iphone|ipad|ipod)/i.test(ua);
	hd = "-scale=" + (hd ? 1 / dpr : 1).toFixed(3) + ",";
	const content = "width=device-width,initial" + hd +
		`maximum${hd}minimum${hd}user-scalable=no`;
	const attrs = { name, content };
	document.querySelector(`meta[name=${name}]`) ||
		create("meta", null, { attrs, parent: head });
	return false; // 目前暂不做高清支持
}).catch(e => e); // FastClick有兼容性问题
// http://momentjs.cn 处理场景:从 当天开始 到 当天结束
const { startDate, endDate, startTime, endTime } = {};
moment(`${startDate} 00:00:00`, "YYYY-MM-DD HH:mm:ss");
moment(`${endDate} 23:59:59`, "YYYY-MM-DD HH:mm:ss");
// 获取当天时间
moment(startTime, "HH:mm:ss");
moment(endTime, "HH:mm:ss").add(1, "d");
// 获取UTC时间
moment().toISOString();
moment().utc().format("YYYY-MM-DD[T]HH:mm:ss[Z]");