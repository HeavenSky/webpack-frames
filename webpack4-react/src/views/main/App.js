import { hot } from "react-hot-loader/root";
import React, { PureComponent } from "react";
import { Layout, Alert, Upload } from "antd";
import { HashRouter } from "react-router-dom";

import Todo from "../todo";
import Async from "../async";
import { RouteMenu } from "../../components/Menu";
import { NAV_MENUS, NAV_MAPS } from "../../constants/columns";
import "./App.less";

class NoAu extends PureComponent {
	state = { arr: Array(30).fill().map((_, i) => i + 1) };
	componentDidMount() {
		const wrap = $(".sort-test");
		wrap.sortable({
			axis: "y",
			items: ">.item",
			stop: (_event, _ui) => {
				// http://api.jqueryui.com/sortable/#method-toArray
				const arr = wrap.sortable("toArray", { attribute: "data-idx" });
				// cancel the sort so the DOM is untouched
				wrap.sortable("cancel");
				// Update the state
				this.setState({ arr });
			},
		}).disableSelection();
	};
	render() {
		const { arr } = this.state;
		return <div className="sort-test">
			<div key="other" className="it-margin">
				<Alert message="系统错误, 请稍后重试..." />
			</div>
			{arr.map(
				v => <div key={v} className="it-margin item" data-idx={v}>
					<Alert message={v} />
				</div>
			)}
		</div>;
	};
};

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
				<Upload name="imageFile" action="/upload"
					showUploadList>
					<Alert message="点击上传文件" />
				</Upload>
				<Todo />
				<Async />
				<NoAu />
			</Content>
			<Footer className="c-footer" />
		</Layout>
	</Layout>
</HashRouter>;
export default hot(App);