export default {
	"ALL /user": {
		name: "test",
		email: "test@qq.com",
	},
	"ALL /user/:id": (req, res) => {
		const { id } = req.params;
		const { body, query } = req;
		const name = Math.random().toString(36).slice(2);
		res.json({
			id, name, body, query,
			email: `${name}@qq.com`,
		});
	},
	NO_MOCK: false,
	// ^^^ 关掉 mock api 设为 true
	// TODO 支持设置一个全局延迟的配置参数
};