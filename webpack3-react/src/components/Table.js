import React from "react";
import { Table } from "antd";

/*
const filters = { status: [1, 0].map(v => ({ text: v, value: v })) };
const sorters = { status: (a, b) => a - b };
const onChange = (pagination, filters, sorter) => 0;
*/
const onFilter = key => (value, record) => record[key] === value;
const WrapTable = ({ columns, sorters, filters, children, ...res }) => {
	// 其它必需属性 rowKey, dataSource
	// columns 需要清理无效的列,有效列必含dataIndex属性
	columns = (columns || []).filter(col => {
		if (col && col.dataIndex) {
			const { dataIndex, filterKey = dataIndex, sorterKey = dataIndex } = col;
			const filter = (filters || {})[filterKey];
			if (filter) {
				col.filters = filter;
				// onFilter 本地模式是一个函数, 服务端模式是false/null/undefined
				col.onFilter = filterKey ? onFilter(filterKey) : null;
			}
			const sorter = (sorters || {})[sorterKey];
			if (sorter) {
				// sorter 本地模式是一个函数, 服务端模式是true
				col.sorter = sorterKey ? sorter : true;
			}
			return true;
		}
		return false;
	});
	return <Table columns={columns} {...res} />;
};
export default WrapTable;