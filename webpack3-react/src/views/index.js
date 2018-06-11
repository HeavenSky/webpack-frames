import React from "react";
import { Router } from "react-router-dom";
import { Layout } from "antd";

import { SIDER_URLS, SIDER_MENU } from "../constants/columns";
import { RouteMenu } from "../components/Menu";
import { RouteList } from "../components/Route";
import entryJsx from "../utils/entryJsx";
import history from "../utils/history";
import routes from "./routes";
import "./index.less";

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
					menus={SIDER_MENU}
					maps={SIDER_URLS}
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
entryJsx(App);