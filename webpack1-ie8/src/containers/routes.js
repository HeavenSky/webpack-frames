import React from "react";
import { Spin } from "antd";

import fnHome from "promise-loader?global,home!../components/Home";
import { bundle } from "../components/Bundle";

const NoAu = props => <div><Spin />法海不懂爱, 页面出不来...</div>;
const Home = bundle({ type: "function", entry: fnHome });
const routes = [
	{ type: "redirect", exact: true, strict: true, from: "/", to: "/home" },
	{ type: "route", path: "/home", component: Home },
	{ type: "route", component: NoAu },
];
export default routes;