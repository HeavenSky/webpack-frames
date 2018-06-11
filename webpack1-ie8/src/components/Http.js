import React from "react";
import { Input } from "antd";
import Select from "./Select";
import { URL_SELECT, formatUrl } from "../utils/fns";

const { HTTP, HTTPS, OPTS } = URL_SELECT;
// value 和 onChange 必须相结合使用, 否则组件的值永远为空
const Http = props => {
	const { addon, value, onChange, disabled, ...res } = props;
	let { httpDefault, ...more } = addon || {};
	delete res.addonBefore;
	delete more.onChange;
	delete more.value;
	httpDefault === HTTPS || (httpDefault = HTTP);
	let { http, link } = formatUrl(value, -1);
	[HTTP, HTTPS].includes(http) || (http = httpDefault);
	const updateSelect = (v = httpDefault) => onChange(v + link);
	const updateInput = e => {
		const url = e.target.value;
		const format = formatUrl(url, -1);
		format.http && ({ http } = format);
		onChange(http + format.link);
	};
	const selector = (
		<Select
			onChange={updateSelect}
			disabled={disabled}
			value={http}
			opts={OPTS}
			{...more}
		/>
	);
	return <Input
		addonBefore={selector}
		onChange={updateInput}
		disabled={disabled}
		value={link}
		{...res}
	/>;
};
export default Http;