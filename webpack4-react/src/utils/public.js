import moment from "moment";
import "moment/locale/zh-cn";
// moment.locale("en" || "zh-cn");
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import "./public.less"; // pace-less/themes/*.less 进度条主题
// 高清方案需要组件时rem尺寸,FastClick在ios的输入框移动焦点有问题
window.__ALL = { moment, nprogress }; // global variable