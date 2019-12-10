![](https://img.shields.io/npm/v/webpack/webpack-3.svg?label=webpack)
![](https://img.shields.io/npm/v/react.svg?label=react)
![](https://img.shields.io/npm/v/antd.svg?label=antd)
![](https://img.shields.io/npm/v/eslint.svg?label=eslint)
![](https://img.shields.io/npm/v/prettier.svg?label=prettier)

### 请仔细阅读上级目录的[README.md](../README.md)
部分重复的文档说明已经提取到上级目录的`README.md`,若有疑问请先参考

### webpack3-react
* 本目录文件夹和`webpack4-react`一致,故若需要自行复制一份
* 采用 `react` 和 `antd` 兼容到浏览器 `IE9` 的 `demo` 例子
* 所有 `dependency` 和 `dev dependency` 均采用最新版本, 具体请见 `package.json`

### 历史技术栈介绍[已大改]
* 初期搭建的时候, 完全参考 https://github.com/brickspert `砖家`的 https://github.com/brickspert/react-family `react-family`项目配置
* 后期配置上改动也很大, 引入了 `antd` `cross-env` `less` `autoprefixer`, 以及配置上的加入多个单页应用的处理
* 关于 `redux` 的是否使用, 个人感觉, 一上来就用 `redux`, 组件耦合高, 逻辑结构复杂, 不利于提取组件和组件迁移复用等; 使用 `redux` 真的是属于吃力不讨好的事情; `如果你不清楚要不要用 redux, 那么就不用`; `redux` 写的项目代码耦合太高, 改动和变更起来十分费劲
* 关于组件之间通信, 一般有如下做法
	* 通过父组件的箭头函数进行子组件之间的通信
	* 通过组件的 `ref` 属性获取组件, 然后直接调用组件的方法
	* 如果想要两个不关联的组件进行通信, 推荐两个插件, 都简单易用(支持 ie8+)
		* https://npmjs.com/package/pubsub-js `pubsub-js` 介绍中有具体例子
		* https://npmjs.com/package/signals `signals` 具体例子要看 https://github.com/millermedeiros/js-signals/wiki/Examples `示例`
	* 组件不要嵌套太深, 嵌套三层就算深了
* 配置新增 `react@16` 对于IE的支持
	* https://doc.react-china.org/docs/javascript-environment-requirements.html `官方介绍`
	* 引入`core-js/es6/map,core-js/es6/set,raf/polyfill`
	* `babel-polyfill` 中已包含 `core-js/es6/map,core-js/es6/set`
* 配置新增 `antd` 支持
	* 兼容 IE 需要引入 `media-match`
	* 按需引入 `babel-plugin-import` (不引入样式时, `vue` 组件 `element-ui` 和 `iview` 也可以用这个来按需引入. 因为样式文件的格式不一样, `antd` 是 `less`, `element-ui` 是 `scss`)
* 配置新增 `less` 支持
* 配置新增 `cross-env` 支持, 统一`win`和`mac`设置生产环境和开发环境
* 配置新增 `cssnano` 支持, css 自动压缩和筛减
* 配置新增 `autoprefixer` 支持, css 自动添加浏览器兼容前缀
* 配置新增 `copy-webpack-plugin` 支持
* 配置新增 `friendly-errors-webpack-plugin` 支持
* 配置新增 `webpack.DllPlugin`, 优化编译速度, 缩小编译文件
* 配置优化 `output` 绝对路径改相对路径
* 配置优化 `bundle-loader` `promise-loader` `import()` 异步组件的创造函数, 具体见 `src/component/Bundle.js`
* 常用 `cdn` 源推荐
	* http://bootcdn.cn `bootcdn` 内容不全, 更新不及时, 国内访问速度快, 资源已经映射到 `cdnjs`, 速度慢了很多
	* https://cdnjs.com `cdnjs` 大而全, 更新迅速及时, 国内访问速度慢, 如果不是速度慢, 最佳选择
	* https://npm.elemecdn.com `elecdn` 大而全, 更新迅速及时, 国内访问速度可以, 但是资源路径非常不清晰
	* https://cdn.jsdelivr.net `jsdelivr` 大而全, 更新迅速及时, 国内访问速度可以, css引用字体资源文件会报错
