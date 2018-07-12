import React, { Component } from "react";
import SimpleMDE from "simplemde";

class Editor extends Component {
	componentDidMount() {
		const { config, update, content } = this.props;
		const opts = Object.assign({
			element: this.dom,
			spellChecker: false,
			autoDownloadFontAwesome: false,
		}, config);
		opts.previewRender = (text, preview) => {
			const { className, style } = preview;
			/\smarkdown-body\s/.test(className + " ") ||
				(preview.className += " markdown-body");
			style.backgroundColor = "#fff";
			return SimpleMDE.prototype.markdown(text);
		};
		const editor = new SimpleMDE(opts);
		editor.codemirror.on("change", () =>
			typeof update === "function" &&
			update(editor.value())
		);
		editor.value(content);
		this.editor = editor;
	}
	componentWillUnmount() {
		this.editor.toTextArea();
		this.editor = undefined;
	}
	shouldComponentUpdate(nextProps, nextState) {
		const { editor } = this;
		if (editor) {
			const { content } = nextProps;
			const html = editor.value();
			content !== html && editor.value(content);
		}
		return false;
	}
	getDOM = v => (this.dom = v);
	render() {
		const { config, update, content,
			staticContext, ...rst } = this.props;
		return <div ref={this.getDOM} {...rst} />;
	}
}
/* markdown编辑器:
https://npmjs.com/package/simplemde
	不含预览样式,预览容器.editor-preview
	SimpleMDE.prototype.markdown=md=>html
https://npmjs.com/package/github-markdown-css
	markdown预览样式,样式容器.markdown-body
https://npmjs.com/package/europa
	new Europa().convert=html=>md
*/
export default Editor;