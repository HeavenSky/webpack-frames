import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import signals from "signals";
import PubSub from "pubsub-js";
import Cookies from "js-cookie";
import nprogress from "nprogress";
import "moment/locale/zh-cn";
import "nprogress/nprogress.css";
import "pace/themes/center-atom.less";
// http://github.hubspot.com/pace
// http://ricostacruz.com/nprogress
import "./public.less";

const { FastClick } = window;
if (FastClick && document.addEventListener) {
	document.addEventListener(
		"DOMContentLoaded",
		() => FastClick.attach(document.body),
		false
	);
}

Object.assign(window, { axios, moment, numeral, signals, PubSub, Cookies, nprogress });