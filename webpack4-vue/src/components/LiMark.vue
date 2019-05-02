<template>
	<transition>
		<keep-alive>
			<textarea
				ref="dom"
				v-bind="$attrs"
			/>
		</keep-alive>
	</transition>
</template>
<script>
import SimpleMDE from "simplemde";
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
		return { editor: undefined };
	},
	watch: {
		content() {
			const { content, editor } = this;
			if (editor) {
				const text = editor.value();
				content !== text && editor.value(content);
			}
		},
	},
	mounted() {
		const { config, content, $refs } = this;
		const opts = Object.assign({
			element: $refs.dom,
			spellChecker: false,
			autoDownloadFontAwesome: false,
		}, config);
		opts.previewRender = (text, preview) => {
			const { className, style } = preview;
			/\smarkdown-body\s/.test(` ${className} `) ||
				(preview.className += " markdown-body");
			style.backgroundColor = "#fff";
			return SimpleMDE.prototype.markdown(text);
		};
		const editor = new SimpleMDE(opts);
		editor.codemirror.on("change", () => {
			const html = editor && editor.value();
			this.$emit("update", html);
		});
		editor.value(content);
		this.editor = editor;
	},
	beforeDestroy() {
		this.editor.toTextArea();
		this.editor = undefined;
	},
};
/* markdown编辑器:
https://npmjs.com/package/simplemde
	不含预览样式,预览容器.editor-preview
	SimpleMDE.prototype.markdown=md=>html
https://npmjs.com/package/github-markdown-css
	markdown预览样式,样式容器.markdown-body
https://npmjs.com/package/europa
	new Europa().convert=html=>md
*/
</script>