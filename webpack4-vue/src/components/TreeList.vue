<template>
	<div>
		<el-button
			v-if="!tree.length"
			size="mini"
			icon="fa fa-plus"
			type="primary"
			@click="()=>tree.push(newNode())">
			{{ "添加顶级 " + label }}
		</el-button>
		<el-tree
			v-if="tree.length"
			ref="tree"
			:default-expand-all="false"
			:expand-on-click-node="!edit&&!link"
			:data="tree"
			node-key="id"
			accordion>
			<span
				slot-scope="{node,data}"
				class="customer-tree-node">
				<span
					v-if="data.edit"
					key="tree-node"
					class="flex">
					<el-input
						v-model="data.codeVal"
						size="mini"
						class="code-ipt"
						placeholder="编码"
						@keyup.enter.native="()=>saveAction(node,data)" />
					<el-input
						v-model="data.descriptionVal"
						size="mini"
						placeholder="描述"
						@keyup.enter.native="()=>saveAction(node,data)" />
					<el-button
						size="mini"
						type="primary"
						@click="()=>saveAction(node,data)">
						保存
					</el-button>
					<el-button
						size="mini"
						type="info"
						@click="()=>closeAction(node,data)">
						取消
					</el-button>
				</span>
				<span
					v-else
					key="tree-node"
					class="flex">
					<span class="text">{{ getText(data) }}</span>

					<router-link
						v-if="link"
						key="action"
						:to="`/curriculum/course/objective=${data.id}`"
						class="action">
						<el-button
							size="mini"
							type="primary">详情与关联</el-button>
					</router-link>

					<span
						v-if="edit"
						key="action"
						class="action">
						<el-tooltip
							effect="dark"
							content="编辑"
							placement="top">
							<el-button
								size="mini"
								icon="fa fa-edit"
								type="primary"
								@click="()=>editAction(node,data)" />
						</el-tooltip>
						<el-tooltip
							:content="`添加同级 ${label}`"
							effect="dark"
							placement="top">
							<el-button
								size="mini"
								icon="fa fa-plus"
								type="primary"
								@click="()=>newSibling(node,data)" />
						</el-tooltip>
						<el-tooltip
							:content="`添加子级 ${label}`"
							effect="dark"
							placement="top">
							<el-button
								size="mini"
								icon="fa fa-level-down"
								type="primary"
								@click="()=>newChild(node,data)" />
						</el-tooltip>
						<el-tooltip
							effect="dark"
							content="删除"
							placement="top">
							<el-button
								size="mini"
								icon="fa fa-trash-o"
								type="danger"
								@click="()=>removeNode(node,data)" />
						</el-tooltip>
					</span>
				</span>
			</span>
		</el-tree>
	</div>
</template>
<script>
const ROOT_UUID = Math.random();
const newUuid = () => Math.random();
let count = 0;
export default {
	props: {
		label: {
			type: String,
			default: "",
		},
		tree: {
			type: Array,
			default: () => [],
		},
		link: {
			type: Boolean,
			default: false,
		},
		edit: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		getText(data) {
			const { code, description } = data || {};
			return (code || "") + " " + (description || "");
		},
		getCurrent(node, data) {
			const list = node.parent.data;
			const { id, children = list } = list;
			const idx = children.findIndex(v => v.id === data.id);
			return {
				parentId: id || ROOT_UUID,
				list: children,
				index: idx,
			};
		},
		newNode(parentId) {
			const code = ++count + "";
			return {
				id: newUuid(),
				code,
				parent: parentId || ROOT_UUID,
				description: "新建" + this.label + " " + code,
				children: [],
			};
		},
		removeNode(node, data) {
			const { list, index } = this.getCurrent(node, data);
			list.splice(index, 1);
		},
		newSibling(node, data) {
			const { list, index, parentId } = this.getCurrent(node, data);
			list.splice(index + 1, 0, this.newNode(parentId));
		},
		newChild(node, data) {
			if (!data.children) {
				this.$set(data, "children", []);
			}
			data.children.splice(0, 0, this.newNode(data.id));
		},
		editAction(node, data) {
			const { list, index } = this.getCurrent(node, data);
			const current = list[index];
			current.edit = true;
			current.codeVal = current.code;
			current.descriptionVal = current.description;
			list.splice(index, 1, { ...current });
		},
		saveAction(node, data) {
			const { list, index } = this.getCurrent(node, data);
			const current = list[index];
			current.code = current.codeVal;
			current.description = current.descriptionVal;
			delete current.edit;
			delete current.codeVal;
			delete current.descriptionVal;
			list.splice(index, 1, { ...current });
		},
		closeAction(node, data) {
			const { list, index } = this.getCurrent(node, data);
			const current = list[index];
			delete current.edit;
			delete current.codeVal;
			delete current.descriptionVal;
			list.splice(index, 1, { ...current });
		},
	},
};
</script>
<style lang="less" >
.customer-tree-node {
	position: relative;
	font-size: 13px;
	width: 880px;
	.text {
		width: 720px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.flex {
		display: flex;
		flex-direction: row;
		align-items: center;
		.action {
			display: none;
		}
		&:hover .action {
			display: block;
		}
		.code-ipt {
			width: 80px;
			margin-right: 10px;
		}
		.el-input__inner {
			height: 2em;
		}
		.el-button--mini {
			margin-left: 10px;
			padding: 3px 8px;
		}
	}
}
</style>