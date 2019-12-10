export default {
	"POST /api/error"(req, res) {
		const { query } = req; const { log } = console;
		Object.keys(req.body).forEach(key =>
			log(`${key}\t\t${req.body[key]}`));
		res.json({ success: true, query });
	},
	"ALL /api/upload": () => ({
		target: "http://74.120.174.62/upload.php",
		changeOrigin: true,
		secure: false,
	}),
}; // 响应(字符|对象);函数(带参-手动处理|无参-配置代理)