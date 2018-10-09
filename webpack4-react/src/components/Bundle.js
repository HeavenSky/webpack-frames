import React, { Component, version } from "react";
import { Spin } from "antd";
import { log } from "../utils/fns";
/*
import { Route } from "react-router-dom";

// 代码切割方法 bundle-loader
import cbHome from "bundle-loader?lazy&name=home/fn!./Home";
<Route component={bundle({ type: "callback", entry: cbHome })} />;

// 代码切割方法 import() 只是webpack@1.x不支持 可用promise-loader代替
import fnHome from "promise-loader?global,home!./Home";
// 命名输出文件方法 https://doc.webpack-china.org/api/module-methods/#import-
const fnHome = () => import(**webpackChunkName:"home"** "./Home");
<Route component={bundle({ type: "function", entry: fnHome })} />;

1. 在 Home 组件出错的时候页面依旧可以加载,但是是切换到加载 Spin 组件
2. 通过 bundle-loader,promise-loader或import() 进行代码切割,按需加载,加快首屏加载时间和减少首屏请求资源
3. 高阶组件react-loadable https://github.com/jamiebuilds/react-loadable
4. vuejs本身直接支持异步组件
5. ServiceWorker缓存实现
https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/src/registerServiceWorker.js
*/
const oldReact = parseFloat(version) < 16.3;
const getState = (pro, sta) => {
	const { empty, type, entry, more, rest } = pro || {};
	if (sta && sta.entry === entry) {
		return {};
	}
	let promise;
	switch (type) {
		case "callback":
			promise = new Promise(entry);
			break;
		case "function":
			promise = Promise.resolve(entry());
			break;
		case "component":
		default:
			promise = Promise.resolve(entry);
			break;
	}
	const param = Object.assign({}, more, rest);
	return {
		Model: empty || Spin,
		promise, param, entry,
	};
};
class Bundle extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		if (oldReact) {
			this.state = getState(props);
			this.componentWillReceiveProps =
				nextProps => this.mounted &&
					this.setState(getState(nextProps));
		}
	};
	updateModel = () => {
		const { promise, Model } = this.state;
		promise.then(mod => {
			if (mod && mod.default) {
				mod = mod.default;
			}
			if (mod !== Model && this.mounted) {
				this.setState({ Model: mod });
			}
			return mod;
		}).catch(e => log.error("Component Bundle", e));
	};
	componentDidMount() {
		this.mounted = true;
		this.updateModel();
	};
	componentDidUpdate = this.updateModel;
	componentWillUnmount() {
		this.mounted = false;
	};
	render() {
		const { Model, param } = this.state;
		return <Model {...param} />;
	};
};
if (!oldReact) {
	Bundle.getDerivedStateFromProps = getState;
}
/*
@empty: 引入前显示的组件
@type: 文件引入类型
	import 直接引入时用component(默认);
	import 分割引入时用function;
	promise-loader 分割引入时用function;
	bundle-loader 分割引入时用callback;
@entry: 引入后显示的组件
@rest: 额外给组件传递的属性
*/
const bundle = ({ empty, type, entry, rest }) => {
	const BundleModel = props => <Bundle
		empty={empty}
		type={type} entry={entry}
		more={props} rest={rest}
	/>;
	return BundleModel;
};

export { Bundle, bundle };