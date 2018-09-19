import React from "react";
import { hot } from "react-hot-loader";
import { Router } from "react-router-dom";

import { NAV_MENUS, NAV_MAPS } from "../constants/columns";
import { RouteList } from "../components/Route";
import { RouteMenu } from "../components/Menu";
import { $get, $post, $form } from "../utils/service";
import history from "../utils/history";
import routes from "./routes";
import "./App.less";

Object.assign(window, { $get, $post, $form });
const App = props =>
	<Router history={history}>
		<div>
			<RouteMenu
				theme="dark"
				mode="horizontal"
				menus={NAV_MENUS}
				maps={NAV_MAPS}
			/>
			<div className="main">
				<RouteList routes={routes} />
			</div>
		</div>
	</Router>;

export default hot(module)(App);