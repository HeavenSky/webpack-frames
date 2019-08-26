import moment from "moment";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import "./public.less";
import { ready, clientInfo } from "./dom";
// global variable for debug
window.GLOBAL = { moment, nprogress };
ready(() => {
	// 暂不考虑做高清方案,大多组件不是rem尺寸
	const { body, fc } = clientInfo(); // 兼容移动端点击事件
	fc && fc.attach(body); // 其实FastClick也存在兼容性问题
}); // pace-less/themes/*.less 自动进度条主题样式