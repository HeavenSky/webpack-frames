import React from "react";
import { Select, Spin } from "antd";
import { lower } from "../utils/fns";

const WrapSelect = props => {
	const { opts = [], valueKey, labelKey, isSearch, loading, ...res } = props;
	const id = valueKey || "id";
	const label = labelKey || "label";
	const extra = { filterOption: false };
	if (isSearch) {
		extra.filterOption = (value, option) =>
			lower(option.props.children).includes(lower(value));
		extra.showSearch = true;
		extra.allowClear = true;
	}
	if (loading) {
		extra.notFoundContent = <Spin size="small" />;
	}
	return <Select {...extra} {...res}>
		{opts.map(
			(v, idx) => !v ||
				<Select.Option
					value={v[id]}
					key={idx}
					{...v}
				>
					{v[label]}
				</Select.Option>
		)}
	</Select>;
};
export default WrapSelect;