import React from "react";
import { Select, Spin } from "antd";
import { lower } from "../utils/fns";

const WrapSelect = props => {
	// https://ant.design/components/select-cn/#API
	const { labelKey = "label", valueKey = "id", opts = [],
		isSearch, loading, ...res } = props;
	const extra = {
		filterOption: true,
		optionFilterProp: "children",
		notFoundContent: loading
			? <Spin size="small" /> : "无匹配结果",
	};
	if (isSearch) {
		extra.allowClear = true;
		extra.showSearch = true;
		extra.filterOption = (ipt, opt) =>
			lower(opt.props.children).includes(lower(ipt));
	}
	return <Select {...extra} {...res}>
		{opts.map(v => !v ||
			<Select.Option {...v}
				key={v[valueKey]}
				value={v[valueKey]}
			>
				{v[labelKey]}
			</Select.Option>
		)}
	</Select>;
};
export default WrapSelect;