import React, { Component, version } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { Menu, Popconfirm, Tooltip, Breadcrumb } from "antd";
import "./Menu.less";

const oldReact = parseFloat(version) < 16.3;
const MENU_MAP = {}; // key: { type, to, href, target, label, icon, disabled },
const MENU_SET = []; // { key, type, hidden, children: [{ key, type, children, hidden }] },
const CURSOR_DEFAULT = "default";
const CURSOR_POINTER = "pointer";
const CURSOR_NOTALOW = "not-allowed";
const Icon = ({ type, className, ...res }) => {
	let cls = className || "";
	cls += /^\s+/.test(type) ? type
		: " anticon anticon-" + type;
	return <i className={cls} {...res} />;
};
const matchPath = href => {
	const { pathname = "", search = "", hash = "" } = window.location;
	return (pathname + search + hash).indexOf(href) === 0;
};
const LinkItem =
	({ link, pathname, cursor, gutter = 10 }) => {
		const { type, icon, label, title, confirm, children, ...res } = link || {};
		const fn = res.onClick;
		if (res.disabled) {
			cursor = CURSOR_NOTALOW;
		} else if (/^a$/i.test(type)) {
			cursor = matchPath(res.href)
				? CURSOR_DEFAULT : CURSOR_POINTER;
		} else if (/^(link|navlink)$/i.test(type)) {
			cursor = pathname === res.to
				? CURSOR_DEFAULT : CURSOR_POINTER;
		} else if (fn) {
			cursor = CURSOR_POINTER;
		}
		res.style = Object.assign({ cursor }, res.style);
		if (confirm) {
			res.onClick = e => e.preventDefault();
		} else if (cursor !== CURSOR_POINTER) {
			res.onClick = e => {
				fn && fn();
				e.preventDefault();
			};
		}
		const near = label ? { marginRight: gutter + "px" } : null;
		const _icon = icon ? <Icon type={icon} style={near} /> : "";
		const _label = icon && label && typeof label === "string"
			? <span>{label}</span> : label || "";
		let node = /^link$/i.test(type) ? <Link {...res}>{_icon}{_label}</Link>
			: /^navlink$/i.test(type) ? <NavLink {...res}>{_icon}{_label}</NavLink>
				: /^a$/i.test(type) || fn ? <a {...res}>{_icon}{_label}</a>
					: <span {...res}>{_icon}{_label}</span>;
		if (title) {
			const tip = {
				title,
				placement: "top",
				arrowPointAtCenter: true,
			};
			node = <Tooltip {...tip}>{node}</Tooltip>;
		}
		if (confirm && !res.disabled) {
			const pop = {
				placement: "topRight",
				title: confirm,
				arrowPointAtCenter: true,
				cancelText: "取消",
				okText: "确定",
				onConfirm: fn,
			};
			node = <Popconfirm {...pop}>{node}</Popconfirm>;
		}
		return node;
	};
const renderMenuItem = (menu, cfg) => {
	const { key, children, hidden, ...res } = menu || {};
	const [maps = MENU_MAP, pathname = ""] = cfg || [];
	const item = Object.assign({ key, to: key }, maps[key]);
	const { disabled } = item;
	return hidden ? false : <Menu.Item
		key={key}
		disabled={disabled}
		{...res}>
		<LinkItem
			key={key}
			link={item}
			pathname={pathname}
			cursor={CURSOR_POINTER}
		/>
	</Menu.Item>;
};
const renderGroupItem = (menu, cfg) => {
	const { key, children, hidden, ...res } = menu || {};
	const [maps = MENU_MAP, pathname = ""] = cfg || [];
	const item = Object.assign({ key, to: key }, maps[key]);
	const { disabled } = item;
	return hidden ? false : <Menu.ItemGroup
		key={key}
		disabled={disabled}
		title={<LinkItem
			key={key}
			link={item}
			pathname={pathname}
		/>}
		{...res}
	>
		{children.map(
			v => renderMenuItem(v, cfg)
		)}
	</Menu.ItemGroup>;
};
const renderSubMenu = (menu, cfg) => {
	const { key, children, hidden, ...res } = menu || {};
	const [maps = MENU_MAP, pathname = ""] = cfg || [];
	const item = Object.assign({ key, to: key }, maps[key]);
	const { disabled } = item;
	return hidden ? false : <Menu.SubMenu
		key={key}
		disabled={disabled}
		title={<LinkItem
			key={key}
			link={item}
			pathname={pathname}
			cursor={CURSOR_POINTER}
		/>}
		{...res}
	>
		{children.map(
			v => renderMenuList(v, cfg)
		)}
	</Menu.SubMenu>;
};
const renderGroupMenu = (menu, cfg) => {
	const { type, children } = menu || {};
	return /group/i.test(type) &&
		children && children.length
		? renderGroupItem(menu, cfg)
		: renderMenuItem(menu, cfg);
};
const renderMenuList = (menu, cfg) => {
	const { type, children } = menu || {};
	return /sub/i.test(type) &&
		children && children.length
		? renderSubMenu(menu, cfg)
		: renderGroupMenu(menu, cfg);
};
const getList = arr => {
	const res = [];
	if (arr) {
		for (let i = 1; i <= arr.length; i++) {
			res.push(arr.slice(0, i).join(""));
		}
	}
	return res;
};
const getKeys = (pro, sta) => {
	const { maps = MENU_MAP, fold, location } = pro || {};
	const { pathname } = location || {};
	if (sta && sta.pathname === pathname) {
		return {};
	}
	let key;
	for (let x in maps) {
		const { type, to = x, href } = maps[x];
		if (/^(link|navlink)$/i.test(type) &&
			pathname === to) {
			key = x;
			break;
		} else if (/^a$/i.test(type) && matchPath(href)) {
			key = x;
			break;
		} else {
			const idx = (pathname || "").indexOf(to);
			idx === 0 && (!key || key < x) && (key = x);
		}
	}
	if (!key) {
		return {};
	}
	const res = key.match(/\/[^/]+/g) || [];
	return {
		openKeys: fold ? [] : getList(res.slice(0, -1)),
		selectedKeys: getList(res), pathname,
	};
};
class WrapMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		if (oldReact) {
			this.state = getKeys(props);
			this.componentWillReceiveProps = nextProps =>
				this.setState(getKeys(nextProps));
		}
	};
	keySwitch = newKeys => {
		const { openKeys } = this.state;
		const newKey = newKeys.find(
			v => !openKeys.includes(v)
		);
		const menu = this.props.menus.find(
			v => v.key === newKey
		);
		this.setState({
			openKeys: !menu ? newKeys
				: newKey ? [newKey] : [],
		});
	};
	render() {
		const { selectedKeys, openKeys } = this.state;
		const {
			menus = MENU_SET,
			maps = MENU_MAP,
			staticContext,
			location,
			...res
		} = this.props;
		const { pathname } = location || {};
		return <Menu
			onOpenChange={this.keySwitch}
			selectedKeys={selectedKeys}
			openKeys={openKeys}
			{...res}
		>
			{menus.map(
				v => renderMenuList(v, [maps, pathname, staticContext])
			)}
		</Menu>;
	};
};
if (!oldReact) {
	WrapMenu.getDerivedStateFromProps = getKeys;
}
const RouteMenu = withRouter(WrapMenu);
const WrapBread =
	({ list = [], ...res }) =>
		<Breadcrumb {...res}>
			{list.map(
				(v, i) => {
					v && !(i || v.icon) &&
						(v.icon = " fa fa-map-marker");
					return <Breadcrumb.Item key={i}>
						<LinkItem link={v} gutter={8} />
					</Breadcrumb.Item>;
				}
			)}
		</Breadcrumb>;
const TitleBar =
	({ list, btns, separator }) =>
		<div className="title-bar-wrap">
			<WrapBread
				list={list || []}
				separator={separator || "/"}
			/>
			<div className="right-btns">
				{btns.map((v, i) => {
					const { icon, label, className = "", ...res } = v;
					const link = {
						className: className + " right-btn",
						label: [
							<span key="icon" className="btn-icon">
								<Icon type={icon} />
							</span>,
							label,
						],
						...res,
					};
					return <LinkItem
						cursor="pointer"
						gutter={6}
						link={link}
						key={i}
					/>;
				})}
			</div>
		</div>;
export { Icon, LinkItem, WrapMenu, RouteMenu, WrapBread, TitleBar };