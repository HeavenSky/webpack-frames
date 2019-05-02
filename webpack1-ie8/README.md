# 提前了解一下
部分重复的文档说明已经提取到上一级的目录的`README.md`, 如果有疑问请重点看一下

# webpack1-ie8
采用 `React` 和 `Ant Design` 兼容到浏览器 `IE8` 的 `demo` 例子.
* 采用低版本兼容的 `dependency` 有 `react@0.x` `antd@1.x` `jquery@1.x`
* 其他 `dependency` 均采用最新版本, 具体请见 `package.json`
* 关于 `dev dependency` 低版本兼容的比较多, 就不一一列举了, 具体请见 `package.json`

## 更新 `package.json` 方法
* 在当前目录执行 `npm update -D -S`
* 还可以安装`npm i -g npm-check-updates`, 然后在当前目录执行 `ncu` 或 `ncu -u`

## 环境准备工作
1. 设置淘宝镜像 `npm config set registry https://registry.npm.taobao.org`
2. 管理员身份运行 `npm i -g npminstall`
3. 命令行进入当前目录,运行 `npminstall -c`
4. 若出现报错,常用解决办法如下:
	- 管理员身份运行`npm cache clean -f`和`npm cache verify -f`
	- 删除`node_modules`目录
	- 重新运行`npminstall -c`
	- 最后换一个好点的网络,升级`node`和`npm`
> `npminstall -c`和`npm install`不兼容,前者比后者快很多,但是不能同时使用,`切换使用需要删除node_modules文件夹`,`node-v12.0.0`有问题请先别升级`node-v12`

## 开发坏境启动
1. `npm start`
2. 浏览器打开 http://localhost:8888

## 生产坏境部署
1. `npm run app`
2. 拷贝dist文件夹内容至服务器即可

## 技术栈介绍
* 初期搭建的时候, 完全参考 [砖家](https://github.com/brickspert)的[react-family-ie8](https://github.com/brickspert/react-family-ie8)项目配置
* 后期配置上改动也很大, 引入了 `antd` `cross-env` `less` `autoprefixer`, 以及配置上的加入多个单页应用的处理
* 关于 `redux` 的是否使用, 个人感觉, 一上来就用 `redux`, 组件耦合高, 逻辑结构复杂, 不利于提取组件和组件迁移复用等; 使用 `redux` 真的是属于吃力不讨好的事情; `如果你不清楚要不要用 redux, 那么就不用`; `redux` 写的项目代码耦合太高, 改动和变更起来十分费劲
* 关于组件之间通信, 一般有如下做法
	* 通过父组件的箭头函数进行子组件之间的通信
	* 通过组件的 `ref` 属性获取组件, 然后直接调用组件的方法
	* 如果想要两个不关联的组件进行通信, 推荐两个插件, 都简单易用(支持 ie8+)
		* [pubsub-js](https://npmjs.com/package/pubsub-js) 介绍中有具体例子
		* [signals](https://npmjs.com/package/signals) 具体例子要看 [这个页面](https://github.com/millermedeiros/js-signals/wiki/Examples)
	* 组件不要嵌套太深, 嵌套三层就算深了
* 配置新增 `antd` 支持
	* 兼容 IE 需要引入 `media-match`
	* 按需引入 `babel-plugin-import` (不引入样式时, `vue` 组件 `element-ui` 和 `iview` 也可以用这个来按需引入. 因为样式文件的格式不一样, `antd` 是 `less`, `element-ui` 是 `scss`)
* 配置新增 `less` 支持
* 配置新增 `cross-env` 支持, 统一`win`和`mac`设置生产环境和开发环境
* 配置新增 `cssnano` 支持, css 自动压缩和筛减
* 配置新增 `autoprefixer` 支持, css 自动添加浏览器兼容前缀
* 配置新增 `copy-webpack-plugin` 支持
* 配置新增 `friendly-errors-webpack-plugin` 支持
* 配置优化 `output` 绝对路径改相对路径
* 配置优化 `bundle-loader` `promise-loader` `import()` 异步组件的创造函数, 具体见 `src/component/Bundle.js`
* 新增兼容 `antd表格表头和列固定的时候` 报错 `IE8 不支持 onScroll 事件`, 具体见 `src/utils/antd.js`
* 新增兼容 `es5-shim`, 支持到 IE8 所必须
* 常用 `cdn` 源推荐
	* [bootcdn](http://bootcdn.cn) 内容不全, 更新不及时, 国内访问速度快, 资源已经映射到 `cdnjs`, 速度慢了很多
	* [cdnjs](https://cdnjs.com) 大而全, 更新迅速及时, 国内访问速度慢, 如果不是速度慢, 最佳选择
	* [elecdn](https://npm.elemecdn.com) 大而全, 更新迅速及时, 国内访问速度可以, 但是资源路径非常不清晰
	* [jsdelivr](https://cdn.jsdelivr.net) 大而全, 更新迅速及时, 国内访问速度可以, css引用字体资源文件会报错

## 刚开始学 webpack, 还有很多不懂, 欢迎指点秘籍, 或者纠错改进, 共同学习,共同进步