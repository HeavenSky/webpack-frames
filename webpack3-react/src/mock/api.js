export default {
	"ALL /user": {
		name: "test",
		email: "test@qq.com",
	},
	"PUT /user/:id": (req, res) => {
		const { id } = req.params;
		const { body, query } = req;
		res.json({ id, body, query });
	},
	// NO_MOCK: true,
	// ^^^ 关掉 mock api
	// TODO 支持设置一个全局延迟的配置参数
};