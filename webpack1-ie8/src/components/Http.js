import React from "react";
import { Input, Select } from "antd";
import { URL_SELECT, formatUrl } from "../utils/fns";

const { Option } = Select;
const { HTTP, HTTPS } = URL_SELECT;
// 受控组件, value 和 onChange 必须结合使用, 否则组件永远为空
const Http = props => {
	const { addonProps, onChange, disabled, value, ...res } = props;
	let { httpDefault, ...more } = addonProps || {};
	let { http, link } = formatUrl(value, -1);
	httpDefault === HTTPS || (httpDefault = HTTP);
	[HTTP, HTTPS].includes(http) || (http = httpDefault);
	const updateSelect = (v = httpDefault) => onChange(v + link);
	const updateInput = e => {
		const url = e.target.value;
		const format = formatUrl(url, -1);
		format.http && ({ http } = format);
		onChange(http + format.link);
	};
	const selector = <Select {...more} value={http}
		disabled={disabled} onChange={updateSelect}>
		<Option value={HTTP}>{HTTP}</Option>
		<Option value={HTTPS}>{HTTPS}</Option>
	</Select>;
	return <Input {...res} disabled={disabled} value={link}
		addonBefore={selector} onChange={updateInput} />;
};
export default Http;