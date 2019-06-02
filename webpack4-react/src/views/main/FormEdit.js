import React, { PureComponent } from "react";
import { Input, Button } from "antd";
import SchemaEditor from "amao-schema-editor";
import { schema, mock } from "schema-util";
import "amao-schema-editor/lib/index.less";

class FormEdit extends PureComponent {
	config = {
		uploadApi: "",
		uploadApiForRichText: "",
		imageUploadOnly: false,
		uploadImgSize: 203800,
		excelImport: false,
		lang: "zh_cn",
		size: "large",
	};
	state = {
		origin: `
Object(大牌劲爆商品) {
	title(标题),
	list(商品列表): Array {
		href(宝贝链接),
		title(标题),
		img(图片地址[272x272]): Image,
		price(花呗价格),
		origin(原价),
		count(折扣)
	}
}
		`,
		json: null,
		data: null,
	};
	handle = e => this.setState({ origin: e.target.value });
	migrate = () => {
		const { origin } = this.state;
		const json = schema(origin);
		const data = mock(json);
		this.setState({ json, data });
	};
	change = data => this.setState({ data });
	render() {
		const { origin, json, data } = this.state;
		return <div>
			<Input.TextArea value={origin} onChange={this.handle} />
			<Button onClick={this.migrate}>转换</Button>
			{json && <SchemaEditor
				config={this.config}
				schema={json}
				value={data}
				onChange={this.change}
			/>}
			<div>{JSON.stringify(data)}</div>
		</div>;
	}
}

export default FormEdit;