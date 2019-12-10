const { WK } = require("./basic");
const LKS = Object.keys(require("lodash"));
/** https://webpack.docschina.org/api/module-factories
https://webpack.docschina.org/plugins/commons-chunk-plugin
https://webpack.js.org/plugins/split-chunks-plugin
https://webpack.js.org/guides/dependency-management
https://webpack.js.org/guides/build-performance
https://webpack.js.org/configuration/dev-server
https://webpack.js.org/api/module-variables
https://webpack.js.org/api/module-methods */
const NAME = "ModulePlugin";
class ModulePlugin {
	constructor(option) { this.option = option; }
	moduleFactory(factoryName, hookName, module) {
		const hookMaps = {
			normalModuleFactory: {
				beforeResolve(module) {
					const { request } = module || {};
					if (/^lodash\.([a-z]*)$/i.test(request)) { // lodash统一版本按需加载
						module.request = request.replace(/^lodash\.([a-z]*)$/i, (_, fn) =>
							`lodash/${LKS.find(v => v.toLowerCase() === fn) || fn}`);
					} else {
						[ // vue分两种包:仅运行时(默认,省30%包大小),包含编译器
							[/^debug$/, "@/utils/debug"], // debug很大且编译有es6,替换掉
							[/^@ant-design\/icons\/lib\/dist$/, "@/utils/icons"],
						].forEach(([reg, str]) => {
							if (!reg.test(request)) { return; }
							module.request = request.replace(reg, str);
						});
					}
					return module;
				},
			},
			contextModuleFactory: {
				beforeResolve(module) {
					const { request, context } = module || {};
					return /moment$/i.test(context) && /^\W*locale$/i.test(request)
						? null : module;
				},
			},
		};
		const { [factoryName]: fns } = hookMaps;
		const { [hookName]: fn } = fns || {};
		return typeof fn === "function" ? fn(module) : module;
	};
	apply(compiler) {
		const camp = str => str.replace(/[A-Z]/g, c => "-" + c.toLowerCase());
		const asyncHook = {
			normalModuleFactory: ["beforeResolve", "afterResolve"],
			contextModuleFactory: ["beforeResolve", "afterResolve", "alternatives"],
		};
		Object.keys(asyncHook).forEach(factoryName => WK < 4
			? compiler.plugin(camp(factoryName), factory =>
				asyncHook[factoryName].forEach(hookName =>
					factory.plugin(camp(hookName), (module, callback) => {
						const result = this.moduleFactory(factoryName, hookName, module);
						result == null ? callback() : callback(null, result);
					})
				)
			)
			: compiler.hooks[factoryName].tap(NAME, factory =>
				asyncHook[factoryName].forEach(hookName =>
					factory.hooks[hookName].tap(NAME, module =>
						this.moduleFactory(factoryName, hookName, module)
					)
				)
			)
		);
	};
}
module.exports = ModulePlugin;