import React, { Component } from "react";
import { Form, Input } from "antd";
import { validator, isArray } from "../utils/fns";

const optional = ["any"];
// https://ant.design/components/form-cn/#Form.Item
const formItemProps = {
	labelCol: {
		className: "label-col",
		lg: { span: 3, offset: 0 },
		md: { span: 5, offset: 0 },
	},
	wrapperCol: {
		className: "wrapper-col",
		lg: { span: 18, offset: 1 },
		md: { span: 16, offset: 1 },
	},
};
class FormEntry extends Component {
	renderFormItem = (id, label, ipt, opt, addon) => {
		// https://ant.design/components/form-cn/#校验规则
		opt || (opt = { rules: [] });
		isArray(opt.rules) || (opt.rules = []);
		opt.rules.push(Object.assign({ validator },
			opt, { id, label, addon, rules: null }));
		const cls = optional.includes(id)
			? "optional-label" : undefined;
		const isText = !ipt || typeof ipt === "string";
		const { getFieldDecorator } = this.props.form;
		return <Form.Item
			{...formItemProps}
			className={cls}
			label={label}>
			{isText
				? <span className="text">{ipt}</span>
				: getFieldDecorator(id, opt)(ipt)
			} {addon}
		</Form.Item>;
	};
	render() {
		return <Form>
			{this.renderFormItem("any", "任意",
				<Input />, { required: true })}
		</Form>;
	}
}
const WrapForm = Form.create()(FormEntry);
export default WrapForm;