/** https://webpack.docschina.org/api/module-factories
https://webpack.docschina.org/plugins/commons-chunk-plugin
https://webpack.js.org/plugins/split-chunks-plugin
https://webpack.js.org/guides/dependency-management
https://webpack.js.org/guides/build-performance
https://webpack.js.org/configuration/dev-server
https://webpack.js.org/api/module-variables
https://webpack.js.org/api/module-methods */
const { WK } = require("./basic");
const LKS = Object.keys(require("lodash"));
const NAME = "ModulePlugin";
class ModulePlugin {
	constructor(option) { this.option = option; }
	moduleFactory(factoryName, hookName, module) {
		const hookMaps = {
			normalModuleFactory: {
				beforeResolve(module) {
					const { request } = module || {}; let check, query;
					if ((check = /^lodash\.([a-z]+)$/.exec(request))) { // lodash统一,按需加载
						query = LKS.find(v => v.toLowerCase() === `${check[1]}`.toLowerCase());
						module.request = `lodash/${query || check[1]}`;
					} else if ((check = /^regenerator-runtime.*$/.exec(request))) {
						module.request = require.resolve(request);
					}
					return module; // return console.log(`\n\n\t${request}\n`);
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