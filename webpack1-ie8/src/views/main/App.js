import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader";
import { Spin } from "antd";

import { RouteMenu } from "../../components/Menu";
import { NAV_MENUS, NAV_MAPS } from "../../constants/columns";
import "./App.less";

import Loadable from "react-loadable";
import pmHome from "promise-loader?global,home!./Home";
const Home = Loadable({ loader: pmHome, loading: Spin });

const NoAu = () => <div>
	<Spin />
	页面出小差, 请稍后重试...
</div>;
const App = () => <HashRouter>
	<div>
		<RouteMenu
			theme="dark"
			mode="horizontal"
			menus={NAV_MENUS}
			maps={NAV_MAPS}
		/>
		<div className="main">
			<Switch>
				<Route path="/home" component={Home} />
				<Route component={NoAu} />
			</Switch>
		</div>
	</div>
</HashRouter>;

export default hot(module)(App);