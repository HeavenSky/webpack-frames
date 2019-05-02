export default {
	"ALL /user": {
		name: "test",
		email: "test@qq.com",
	},
	"GET /user": "user string",
	"ALL /user/:id"(req, res) {
		const { id } = req.params;
		const { body, query } = req;
		const name = Math.random().toString(36).slice(2);
		res.json({
			id, name, body, query,
			email: `${name}@qq.com`,
		});
	},
	"ALL /upload": () => ({
		target: "http://74.120.174.62/upload.php",
		changeOrigin: true,
		secure: false,
	}),
	/* 将字符串认定为设定响应的字符串
		将对象认定为设定响应的JSON字符串
		将带参函数认定为自定义处理请求或响应
		将无参函数认定为返回一个代理配置 */
	NO_MOCK: false, // 关掉 mock api, NO_MOCK 设为 true
	// 似乎没必要:设计一种配置支持全局延迟和独自延迟,牺牲自由度
	// 似乎没必要:做一个自动根据文件路径来映射的请求,牺牲自由度
};