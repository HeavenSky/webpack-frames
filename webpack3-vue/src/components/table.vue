<template>
	<el-table
		:data="list"
		:span-method="spanFn"
		size="mini"
		height="75vh"
		class="relation"
		border
		stripe>
		<el-table-column
			v-for="(column,idx) in columns"
			v-bind="getOuter(column)"
			:key="idx"
			size="mini">
			<template v-if="(column.children||[]).length">
				<el-table-column
					v-for="(col,i) in column.children"
					v-bind="getInner(col)"
					:key="i"
					size="mini" />
			</template>
		</el-table-column>
	</el-table>
</template>
<script>
export default {
	props: {
		list: {
			type: Array,
			default: () => [],
		},
		columns: {
			type: Array,
			default: () => [],
		},
		spanFn: {
			type: [Function, null],
			default: null,
		},
	},
	methods: {
		getOuter(column) {
			const col = Object.assign({ align: "center" }, column);
			delete col.key;
			delete col.size;
			delete col.children;
			return col;
		},
		getInner(column) {
			const { label, width = 50 } = column;
			const col = Object.assign(
				{
					align: "center",
					prop: label,
					width,
				},
				column
			);
			delete col.key;
			delete col.size;
			delete col.children;
			return col;
		},
	},
};
</script>