import moment from "moment";
import "moment/locale/zh-cn";
import numeral from "numeral";
import PubSub from "pubsub-js";
import { Signal } from "signals";
import "nprogress/nprogress.css";
import "./public.less";
// import "pace-less/themes/center-atom.less";
import { ready, clientInfo } from "./dom";
// global variable to debug
Object.assign(window, { moment, numeral, PubSub, Signal });
// ployfill console print
const log = window.console || { memory: {} };
(window.console = log) && [
	"debug", "error", "info", "log", "warn", "dir",
	"dirxml", "table", "trace", "group", "groupCollapsed",
	"groupEnd", "clear", "count", "assert", "markTimeline",
	"profile", "profileEnd", "timeline", "timelineEnd",
	"time", "timeEnd", "timeStamp", "context",
].forEach(v => log[v] || (log[v] = () => null));
// compatible mobile retina hd and click event
ready.then(() => { // 目前暂不做高清支持
	const { body, fc } = clientInfo();
	return fc && fc.attach(body); // 兼容处理移动端点击事件
}).catch(log.error); // FastClick有兼容性问题
// http://momentjs.cn 处理场景:从 当天开始 到 当天结束
const { startDate, endDate, startTime, endTime } = log;
moment(`${startDate} 00:00:00`, "YYYY-MM-DD HH:mm:ss");
moment(`${endDate} 23:59:59`, "YYYY-MM-DD HH:mm:ss");
// 获取当天时间
moment(startTime, "HH:mm:ss");
moment(endTime, "HH:mm:ss").add(1, "d");
// 获取UTC时间
moment().toISOString();
moment().utc().format("YYYY-MM-DD[T]HH:mm:ss[Z]");