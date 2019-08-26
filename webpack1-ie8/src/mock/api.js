export default {
	"POST /api/error"(req, res) {
		const { query, body } = req;
		Object.keys(body).forEach(key =>
			console.log(`${key}\t\t${body[key]}`));
		res.json({ success: true, query, body });
	},
	"ALL /api/upload": () => ({
		target: "http://74.120.174.62/upload.php",
		changeOrigin: true,
		secure: false,
	}),
}; // 响应(字符|对象);函数(带参-手动处理|无参-配置代理)