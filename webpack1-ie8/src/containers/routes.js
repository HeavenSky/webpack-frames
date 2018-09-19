import React from "react";
import { Spin } from "antd";

import fnHome from "promise-loader?global,home!../components/Home";
import { bundle } from "../components/Bundle";

const NoAu = props => <div><Spin />页面出错了, 请确认后刷新重试...</div>;
const Home = bundle({ type: "function", entry: fnHome });
const routes = [
	{ type: "redirect", exact: true, strict: true, from: "/", to: "/home" },
	{ type: "route", path: "/home", component: Home },
	{ type: "route", component: NoAu },
];
export default routes;