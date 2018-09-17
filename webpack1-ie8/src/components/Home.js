import React, { Component } from "react";
import { Button, Icon, InputNumber, Spin, Tooltip, Table, Cascader, Collapse, DatePicker, Timeline } from "antd";
import Select from "./Select";
import { $get } from "../utils/service";
import { shimAntdTable } from "../utils/antd";

const OPTS = ["ActionScript", "C", "Clojure", "CoffeeScript", "CSS", "Go", "Haskell", "HTML", "Java", "JavaScript", "Lua", "Matlab", "Objective-C", "Perl", "PHP", "Python", "R", "Ruby", "Scala", "Shell", "Swift", "TeX", "TypeScript", "Vim script"].map(v => ({ id: v, label: v }));
const ORDERS = [{ id: "asc", label: "顺序" }, { id: "desc", label: "倒序" }];
const List = ({ items, ...res }) =>
	<Collapse accordion {...res}>
		{items.map(v => {
			const { id, name, description } = v;
			const url = v["html_url"];
			const count = v["stargazers_count"];
			return <Collapse.Panel key={id}
				header={
					<span>
						<Tooltip title={url}>
							<a href={url}>{name}</a>
						</Tooltip>
						<span className="offset">
							<Icon type="star" />
							{`stars: ${count}`}
						</span>
					</span>
				}
			>
				{description}
			</Collapse.Panel>;
		})}
	</Collapse>;
class Test extends Component {
	state = {
		items: [],
		lang: "JavaScript",
		order: "desc",
		loading: false,
	};
	update = state => state && this.mounted && this.setState(state);
	load = (key, val) => {
		const res = { loading: true };
		if (key) {
			res[key] = val;
		}
		this.update(res);
		const { lang, order } = Object.assign(this.state, res);
		$get(
			"https://api.github.com/search/repositories",
			{
				q: `topic:${lang} language:${lang}`,
				sort: "stars", order,
			}
		).done(
			({ items }) => items && this.update({ items })
		).always(e => this.update({ loading: false }));
	};
	switch = key => e => {
		const val = e && e.target
			? e.target.value : e;
		this.load(key, val);
	};
	componentDidMount() {
		this.mounted = true;
		this.load();
	};
	componentWillUnmount() {
		this.mounted = false;
	};
	render() {
		const { items, order, lang, loading } = this.state;
		return <Spin spinning={loading}>
			<span className="offset">语言:</span>
			<Select isSearch
				disabled={loading}
				value={lang}
				onChange={this.switch("lang")}
				opts={OPTS}
				className="wd120"
			/>
			<span className="offset">排序:</span>
			<Select
				disabled={loading}
				value={order}
				onChange={this.switch("order")}
				opts={ORDERS}
			/>
			<List items={items} />
		</Spin>;
	};
};
class Hello extends Component {
	state = {
		list: [],
		loading: false,
		options: [],
	};
	cols = data => {
		const columns = [{
			key: "idx",
			title: "序号",
			fixed: "left",
			render: (v, r) => data.indexOf(r) + 1,
		}, {
			key: "act",
			title: "操作",
			fixed: "right",
			render: (v, r) => <span>
				<Icon type="copy anchor" />
				<Icon type="edit anchor" />
				<Icon
					type="delete danger"
					onClick={
						e => {
							const i = data.indexOf(r);
							const list = data.slice();
							list.splice(i, 1);
							this.setState({ list });
						}
					} />
			</span>,
		}];
		if (data && data[0]) {
			for (let x in data[0]) {
				columns.splice(-1, 0, {
					title: x,
					dataIndex: x,
					key: x,
				});
			}
		}
		return columns;
	};
	load = () => {
		this.setState({ loading: true });
		$.when(
			$get("json/division.json"),
			$get("json/patent.json")
		).done(
			([options], [list]) => this.setState({ list, options })
		).always(
			() => this.setState({ loading: false })
		);
	}
	componentDidMount() {
		this.load();
	};
	componentDidUpdate = shimAntdTable;
	render() {
		const { list, loading, options } = this.state;
		return <Spin spinning={loading}>
			<Cascader
				className="wd200"
				placeholder="请选择省市行政区..."
				options={options}
				showSearch
			/>
			<Button
				className="offset"
				type="primary"
				disabled={loading}
				onClick={this.load}
			>重新加载</Button>
			<Table
				dataSource={list}
				columns={this.cols(list)}
				scroll={{ x: 800, y: 200 }}
			/>
		</Spin>;
	};
};
const Home = props => <div>
	<Test />
	<Hello />
	<DatePicker.RangePicker showTime format="yyyy-MM-dd HH:mm:ss" />
	<div />
	<DatePicker.RangePicker />
	<div />
	<DatePicker />
	<div />
	<InputNumber />
	<Timeline>
		<Timeline.Item>创建服务现场 2015-09-01</Timeline.Item>
		<Timeline.Item>初步排除网络异常 2015-09-01</Timeline.Item>
		<Timeline.Item
			dot={<Icon type="clock-circle-o" />}
		>技术测试异常 2015-09-01</Timeline.Item>
		<Timeline.Item>网络异常正在修复 2015-09-01</Timeline.Item>
	</Timeline>
</div>;
export default Home;