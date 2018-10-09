import React from "react";
import { Select, Spin } from "antd";

const { Option, OptGroup } = Select;
const lower = v => String(v || "").toLowerCase();
/**
 * WrapSelect
 * React Select 封装组件 依赖 antd{Select,Spin}
 * https://ant.design/components/select-cn/#API
 * @param {Object} props
 * @param {Boolean} props.openSearch 是否开启搜索
 * @param {Boolean} props.fetching 是否是否正在拉取数据
 * @param {Array} props.options 选项数据数组 默认值 [] 示例 [{label:"文字",value:"word"}]
 * @param {String} props.labelKey 选项元素的labelKey 默认值 "label"
 * @param {String} props.valueKey 选项元素的valueKey 默认值 "value"
 * @param {String} props.groupLabelKey 选项元素的groupLabelKey 默认值 "groupLabel"
 * @param {String} props.groupListKey 选项元素的groupListKey 默认值 "groupList"
 * @returns React Select Element
 */
const WrapSelect = props => {
	const { openSearch, fetching, options = [],
		labelKey = "label", valueKey = "value",
		groupLabelKey = "groupLabel",
		groupListKey = "groupList", ...res } = props;
	const extra = {
		notFoundContent: fetching
			? <Spin size="small" /> : undefined,
	};
	if (openSearch) {
		Object.assign(extra, {
			allowClear: true,
			showSearch: true,
			optionFilterProp: "children",
			filterOption: (input, option) =>
				lower(option.props.children)
					.includes(lower(input)),

		});
	}
	return <Select {...extra} {...res}>
		{options.map((v, i) => {
			const {
				[labelKey]: label,
				[valueKey]: value,
				[groupLabelKey]: groupLabel,
				[groupListKey]: groupList,
				...other
			} = v || {};
			return groupList && groupList.length
				? <OptGroup key={i} label={groupLabel}>
					{groupList.map(({
						[labelKey]: labelI,
						[valueKey]: valueI,
						...more
					}, idx) => <Option key={idx} {...more}
						value={valueI}>{labelI}</Option>)}
				</OptGroup>
				: <Option key={i} {...other} value={value}>
					{label}</Option>;
		})}
	</Select>;
};
export default WrapSelect;