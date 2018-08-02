import React from "react";
import { Router } from "react-router-dom";
import { Layout } from "antd";
import {hot} from "react-hot-loader";

import { NAV_MENUS, NAV_MAPS } from "../constants/columns";
import { RouteList } from "../components/Route";
import { RouteMenu } from "../components/Menu";
import history from "../utils/history";
import routes from "./routes";
import "./App.less";

const { Header, Footer, Sider, Content } = Layout;
const App = props =>
	<Router history={history}>
		<Layout>
			<Sider
				className="c-sider"
				breakpoint="md"
				collapsible
			>
				<div className="logo" />
				<RouteMenu
					theme="dark"
					mode="inline"
					menus={NAV_MENUS}
					maps={NAV_MAPS}
				/>
			</Sider>
			<Layout className="c-layout">
				<Header className="c-header" />
				<Content>
					<RouteList routes={routes} />
				</Content>
				<Footer className="c-footer" />
			</Layout>
		</Layout>
	</Router>;
export default hot(module)(App);