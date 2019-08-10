<template>
	<transition>
		<keep-alive>
			<div
				ref="dom"
				v-bind="$attrs"
			/>
		</keep-alive>
	</transition>
</template>
<script>
import E from "wangeditor";
import { join } from "../utils/fns";
let key = "$textElem";
if (E.config) {
	key = "$txt";
	E.config.printLog = false;
}
export default {
	model: {
		prop: "content",
		event: "update",
	},
	props: {
		config: {
			type: Object,
			default: Object,
		},
		content: {
			type: String,
			default: "",
		},
	},
	data() {
		return { editor: void 0 };
	},
	watch: {
		content() {
			const { content, editor } = this;
			if (editor) {
				const $con = editor[key];
				const html = $con.html();
				content !== html && $con.html(content);
			}
		},
	},
	mounted() {
		const { config, content, $refs } = this;
		const editor = new E($refs.dom);
		if (E.config) {
			join(editor.config, {
				jsFilter: false,
				pasteText: false,
				pasteFilter: false,
				withCredentials: false,
			}, config);
			editor.onchange = () =>
				this.$emit("update", editor[key].html());
		} else {
			join(editor.customConfig, {
				debug: false,
				pasteIgnoreImg: false,
				pasteFilterStyle: false,
				uploadImgShowBase64: false,
			}, config);
			editor.customConfig.onchange = () =>
				this.$emit("update", editor[key].html());
		}
		editor.create();
		editor[key].html(content);
		this.editor = editor;
	},
	beforeDestroy() {
		this.editor = void 0;
	},
};
/*
https://npmjs.com/package/wangeditor
	2.x样式预览容器 .wangEditor-txt **
	3.x样式预览容器 .w-e-text **
自定义配置说明:
wangeditor@2.1.23/wangeditor.js#超时时间
	editor.$txt是jquery封装的div,编辑器的可编辑区域
wangeditor@3.1.1/wangeditor.js#是否开启
	editor.$textElem是jquery封装的div,编辑器的可编辑区域
*/
</script>