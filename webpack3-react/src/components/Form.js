import React, { Component } from "react";
import { Form, Input } from "antd";
import { validator } from "../utils/fns";

const optional = [];
const formItemLayout = {
	labelCol: {
		lg: { span: 4, offset: 0 },
		sm: { span: 6, offset: 0 },
	},
	wrapperCol: {
		lg: { span: 20, offset: 0 },
		sm: { span: 16, offset: 1 },
	},
};
class CustomIpt extends Component {
	renderFormItem = (label, name, ipt, opt, addon) => {
		const { form: { getFieldDecorator } } = this.props;
		const options = Object.assign({}, opt);
		const rule = Object.assign({ label, validator }, opt);
		options.rules = [rule];
		return (
			<Form.Item label={label} {...formItemLayout}
				className={optional.includes(name) ? "optional-label" : null}>
				{ipt && ipt.props ? getFieldDecorator(name, options)(ipt)
					: <span className="form-item-text">{ipt}</span>}
				{addon}
			</Form.Item>
		);
	};
	render() {
		return <Form>
			{this.renderFormItem("任意", "any", <Input />, { required: true })}
		</Form>;
	}
}
const CustomForm = Form.create()(CustomIpt);
export default CustomForm;