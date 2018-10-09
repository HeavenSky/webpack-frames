export default {
	// 将对象认定为设定响应为对象的 JSON 字符串
	"ALL /user": {
		name: "test",
		email: "test@qq.com",
	},
	// 将带参函数认定为自定义处理请求或响应
	"ALL /user/:id": (req, res) => {
		const { id } = req.params;
		const { body, query } = req;
		const name = Math.random()
			.toString(36)
			.slice(2);
		res.json({
			id,
			name,
			body,
			query,
			email: `${name}@qq.com`,
		});
	},
	// 将无参函数认定为返回一个代理配置
	"GET /yinsiquan-policy.html": () => ({
		target: "https://www.baidu.com/duty",
		changeOrigin: true,
		secure: false,
	}),
	NO_MOCK: false,
	// ^^^ 关掉 mock api, NO_MOCK 设为 true
	// TODO 设计一种配置支持全局延迟和独自延迟
};
