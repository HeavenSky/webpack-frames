import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { bundle } from "./Bundle";

const ROUTES = []; // { type, path, component, sensitive, exact, strict, push, from, to },
const PARAMS = {}; // 给路由渲染的组件传递额外的参数
const getRoute = (route, key) =>
	/^redirect$/i.test(route.type)
		? <Redirect key={key} {...route} />
		: /^route$/i.test(route.type)
			? <Route key={key} {...route} /> : "";
const WrapRoute = props => {
	const { route, more } = props;
	const res = Object.assign({}, route, more);
	const { path, from } = res;
	const key = path || from || Math.random();
	return getRoute(res, key);
};
const RouteList = props => {
	// checkAuth 权限检查, 类似: route=>Promise.resolve(<div />) 或 route=><div />
	const {
		routes = ROUTES,
		params = PARAMS,
		noSwitch, checkAuth,
	} = props;
	const list = routes.map(
		(v, i) => {
			const route = Object.assign({}, v);
			// 对非公开路由进行权限检查
			if (typeof checkAuth === "function") {
				const fn = () => checkAuth(route);
				route.component = bundle({
					type: "function",
					entry: fn,
					rest: params,
				});
			}
			return getRoute(route, i);
		}
	);
	return noSwitch ? list : <Switch>{list}</Switch>;
};
export { WrapRoute, RouteList };