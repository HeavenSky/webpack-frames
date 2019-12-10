import { hot } from "react-hot-loader/root";
import React from "react";
import { Layout, Alert, Upload } from "antd";
import { HashRouter, withRouter } from "react-router-dom";

import Todo from "../todo";
import Async from "../async";
import { RouteMenu } from "../../components/Menu";
import { NAV_MENUS, NAV_MAPS } from "../../constants/columns";
import "./App.less";

// import FormEdit from "./FormEdit";
const throwErr = () => { throw Error("测试点击报错"); };
const NoAu = withRouter(props =>
	<Upload name="imageFile" action="/upload" showUploadList>
		<Alert message={props.location.pathname} />
	</Upload>);

const { Header, Footer, Sider, Content } = Layout;
const App = () => <HashRouter>
	<Layout className="c-whole">
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
			<Content className="c-content">
				{/* <FormEdit /> */}
				<Todo />
				<NoAu />
				<Async />
			</Content>
			<Footer className="c-footer" onClick={throwErr} />
		</Layout>
	</Layout>
</HashRouter>;
export default hot(App);