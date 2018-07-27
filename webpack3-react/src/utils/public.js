import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import signals from "signals";
import PubSub from "pubsub-js";
import Cookies from "js-cookie";
import nprogress from "nprogress";
import "moment/locale/zh-cn";
import "nprogress/nprogress.css";
// import "pace/themes/center-atom.less";
// http://github.hubspot.com/pace
// http://ricostacruz.com/nprogress
import "./public.less";

// ployfill console print
const log = window.console || { memory: {} };
(window.console = log) && [
	"debug", "error", "info", "log", "warn", "dir",
	"dirxml", "table", "trace", "group", "groupCollapsed",
	"groupEnd", "clear", "count", "assert", "markTimeline",
	"profile", "profileEnd", "timeline", "timelineEnd",
	"time", "timeEnd", "timeStamp", "context",
].forEach(v => log[v] || (log[v] = x => 0));
// http://momentjs.cn 处理场景 从 当天开始 到 当天结束
moment().hours(0).minutes(0).seconds(0).toISOString();
moment().hours(23).minutes(59).seconds(59).toISOString();
moment().utc().format("YYYY-MM-DD[T]HH:mm:ss[Z]");
// compatible mobile click event
document.addEventListener && document.addEventListener(
	"DOMContentLoaded", () => {
		const { FastClick } = window;
		FastClick && FastClick.attach(document.body);
	}, false);
// global variable for debug
Object.assign(window, {
	axios, moment, numeral, signals,
	PubSub, Cookies, nprogress,
});