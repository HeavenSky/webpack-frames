<template>
	<transition>
		<keep-alive>
			<el-row
				v-if="!hide"
				:size="size"
				type="flex"
				class="entry-row-line">
				<el-col
					:size="size"
					:span="7">
					{{ label }}
				</el-col>
				<el-col
					:size="size"
					:span="16"
					:offset="1">
					<span
						v-if="read"
						key="entry-switch"
						v-bind="attrCfg">
						{{ txt }}
					</span>
					<el-radio-group
						v-else-if="isRadio"
						key="entry-switch"
						v-bind="attrCfg"
						v-model="ipt">
						<el-radio-button
							v-for="(opt,idx) in opts||[]"
							:size="size"
							:label="opt.id"
							:key="idx">
							{{ opt.label }}
						</el-radio-button>
					</el-radio-group>
					<el-select
						v-else-if="isSelect"
						key="entry-switch"
						v-bind="attrCfg"
						v-model="ipt"
						filterable>
						<el-option
							v-for="(opt,idx) in opts||[]"
							:size="size"
							:value="opt.id"
							:label="opt.label"
							:key="idx" />
					</el-select>
					<el-time-picker
						v-else-if="isTimePicker"
						key="entry-switch"
						:type="type"
						v-bind="attrCfg"
						v-model="ipt" />
					<el-date-picker
						v-else-if="isDatePicker"
						key="entry-switch"
						:type="type"
						v-bind="attrCfg"
						v-model="ipt" />
					<el-input
						v-else
						key="entry-switch"
						:type="type"
						v-bind="attrCfg"
						v-model="ipt" />
				</el-col>
			</el-row>
		</keep-alive>
	</transition>
</template>
<script>
// cfg对象示例
const cfg = {
	id: "key",
	label: "title",
	type: "radio",
	note: "备注",
	read: true,
	hide: false,
	opts: [{ id: 1, label: "选项" }],
};
export default {
	props: {
		cfg: {
			type: Object,
			default: cfg,
		},
		read: {
			type: Boolean,
			default: true,
		},
		value: {
			type: null,
			default: undefined,
		},
	},
	data() {
		const { id, label, opts, type, hide, read, note, attr } = this.cfg || {};
		const attrCfg = {
			size: "mini",
			read: read || this.read,
			placeholder: note || "请输入...",
		};
		Object.assign(attrCfg, attr, this.$attrs);
		const res = { id, label, opts, type, hide, attrCfg };
		Object.assign(res, {
			ipt: this.value,
			read: attrCfg.read,
			size: attrCfg.size,
		});
		return res;
	},
	computed: {
		txt() {
			const { ipt, opts } = this;
			const opt = (opts || []).find(v => v.label === ipt);
			return opt ? opt.label : ipt;
		},
		isRadio() {
			if (this.type === "radio") {
				return true;
			}
			const { multiple } = this.attrCfg;
			const { length } = this.opts || [];
			return !multiple && [1, 2, 3].includes(length);
		},
		isSelect() {
			if (this.type === "select") {
				return true;
			}
			const { multiple } = this.attrCfg;
			const { length } = this.opts || [];
			return multiple ? length > 0 : length > 3;
		},
		isTimePicker() {
			return this.type === "time";
		},
		isDatePicker() {
			const list = "year,month,date,week,datetime,daterange,datetimerange".split(",");
			return list.includes(this.type);
		},
	},
	watch: {
		value() {
			this.ipt = this.value;
		},
		ipt() {
			this.$emit("input", this.ipt);
		},
	},
};
</script>
<style>
.entry-row-line {
	margin: 0.5em 0;
}
</style>