<template>
	<transition>
		<keep-alive>
			<el-table v-bind="$attrs">
				<template v-if="columns.length">
					<el-table-column
						v-for="(column,index) in columns"
						:key="column.key||index"
						v-bind="column"
					>
						<template v-if="column.children.length">
							<el-table-column
								v-for="(col,idx) in column.children"
								:key="col.key||idx"
								v-bind="col"
							/>
						</template>
					</el-table-column>
				</template>
			</el-table>
		</keep-alive>
	</transition>
</template>
<script>
export default {
	props: {
		columns: {
			type: Array,
			default: Array,
		},
	},
};
</script>