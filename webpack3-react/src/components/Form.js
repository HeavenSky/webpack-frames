import React, { Component } from "react";
import { Form, Input } from "antd";
import { validator, isArray } from "../utils/fns";

const optional = ["any"];
const formItemLayout = {
	labelCol: {
		lg: { span: 4, offset: 0 },
		sm: { span: 6, offset: 0 },
	},
	wrapperCol: {
		lg: { span: 19, offset: 1 },
		sm: { span: 17, offset: 1 },
	},
};
class FormEntry extends Component {
	renderFormItem = (id, label, ipt, opt, addon) => {
		// https://ant.design/components/form-cn/#校验规则
		const { rules, ...set } = opt || {};
		const own = { ...set, id, label, addon, validator };
		if (isArray(rules)) {
			rules.push(own);
			set.rules = rules;
		} else {
			set.rules = [own];
		}
		const cls = optional.includes(id)
			? "optional-label" : undefined;
		const isText = !ipt || typeof ipt === "string";
		const { getFieldDecorator } = this.props.form;
		return (
			<Form.Item
				{...formItemLayout}
				className={cls}
				label={label}>
				{isText
					? <span className="text">{ipt}</span>
					: getFieldDecorator(id, set)(ipt)
				} {addon}
			</Form.Item>
		);
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