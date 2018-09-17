## 重要说明
1. `webpack4-*/src` 文件夹缺失请手动从对应 `webpack3-*/src` 拷贝一份
2. 开发环境已经做了热重载, 热重载不兼容 ie11 以下环境, 所以开发环境就不做兼容 ie11 以下了, 生产环境还是兼容的
3. 若还是想开发环境兼容ie11以下, 请做实现热重载的逆向操作
	* `.babel` plugins 中移除 react-hot-loader/babel
	* `package.json` devDependencies 中移除 react-hot-loader
	* `webpack.cfg.dev.js` devServer.inline 一定要为 false (Vue框架仅需改此一条)
	* 根组件移除 export 时修饰
```js
import { hot } from 'react-hot-loader'; // 移除删掉
...
export default hot(module)(App); // 改成 export default App;
```
4. 开发环境已经支持前端 mock api, 会自动读取 `src/mock` 文件夹下的文件, 并进行热更新, 逻辑代码在对应项目下的`browser.js`, 示例参考 `webpack3-react/src/mock/api.js`, 若想关掉 mock api, 只需一个文件内配置 `NO_MOCK:true`

### 更新说明
1. 配置变化比较大, 几乎将可配置的内容全部提取到 `webpack.ini.js` 内, 基本统一了 `webpack1 webpack3 webpack4 react vue` 各种框架的配置
2. 对于 `webpack4-*/src` 因为和 `webpack3-*/src` 没有区别, 就不再拷贝一份代码到该目录了
3. 将不再更新 `README.md` (变化太多,改起来有点烦), 具体关键点在 `webapck.*.js` 中有注释和相对应官方文档地址参考

### react-hot-loader 4.x
> https://github.com/gaearon/react-hot-loader#getting-started `使用方法`
> https://segmentfault.com/a/1190000012814005 `排错教程`

1. `package.json` devDependencies 中加入 react-hot-loader
2. `webpack.cfg.dev.js` devServer.inline 一定要为 true
3. `.babel` plugins 中加入 react-hot-loader/babel
4. 启动命令使用 --hot, 配置就不要用 HotModuleReplacementPlugin
5. 根组件 export 时修饰
```js
import { hot } from 'react-hot-loader';
...
export default hot(module)(App);
```

### 热重载(hot reload)
1. `WebpackDevServer` 的 inline 配置必须为 true, 然而 ie11 以下不支持 inline
2. react 使用 react-hot-loader, vue 本身支持热重载

### webpack3 支持 ie8 研究
1. DllPlugin 打包后的代码未经过转换, 极大可能存在不兼容问题, 因此打包速度无法较大提升
2. hot reload 原理是 Object.defineProperty, ie8 不支持
3. 无法使用最新 react/antd, react@0.x/antd@1.x 才支持 ie8; vue直接就不支持ie8
4. 至此 webpack3 的一些优势近乎都不支持, 暂不考虑 webpack3, 而且网上版本的兼容性都不是很好
5. 如果实在想用webpack3兼容ie8, 未做全面测试, 以下仅供参考
	* https://github.com/ediblecode/webpack3-ie8
	* https://github.com/natural-fe/natural-cli/blob/master/ie8-mvvm.md