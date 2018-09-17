# 说明
文档内存在部分说明错误,请结合上一级目录的readme一起查看

# webpack3-react
采用 `React` 和 `Ant Design` 兼容到浏览器 `IE9` 的 `demo` 例子.
* 所有 `dependency` 和 `dev dependency` 均采用最新版本, 具体请见 `package.json`

## 技术栈介绍
* 初期搭建的时候, 完全参考 [砖家](https://github.com/brickspert)的[react-family](https://github.com/brickspert/react-family)项目配置
* 后期配置上改动也很大, 引入了 `antd` `cross-env` `less` `autoprefixer`, 以及配置上的加入多个单页应用的处理
* 关于 `redux` 的是否使用, 个人感觉, 一上来就用 `redux`, 组件耦合高, 逻辑结构复杂, 不利于提取组件和组件迁移复用等; 使用 `redux` 真的是属于吃力不讨好的事情; `如果你不清楚要不要用 redux, 那么就不用`; `redux` 写的项目代码耦合太高, 改动和变更起来十分费劲
* 关于组件之间通信, 一般有如下做法
	* 通过父组件的箭头函数进行子组件之间的通信
	* 通过组件的 `ref` 属性获取组件, 然后直接调用组件的方法
	* 如果想要两个不关联的组件进行通信, 推荐两个插件, 都简单易用(支持 ie8+)
		* [pubsub-js](https://npmjs.com/package/pubsub-js) 介绍中有具体例子
		* [signals](https://npmjs.com/package/signals) 具体例子要看 [这个页面](https://github.com/millermedeiros/js-signals/wiki/Examples)
	* 组件不要嵌套太深, 嵌套三层就算深了
* 配置新增 `react@16` 对于IE的支持
	* [官方介绍](https://doc.react-china.org/docs/javascript-environment-requirements.html)
	* 引入`core-js/es6/map,core-js/es6/set,raf/polyfill`
	* `babel-polyfill` 中已包含 `core-js/es6/map,core-js/es6/set`
* 配置新增 `antd` 支持
	* 兼容 IE9 需要引入 `media-match`
	* 按需引入 `babel-plugin-import` (vue 组件 `element-ui` 和 `iview` 也可以用这个来按需引入)
* 配置新增 `less` 支持
* 配置新增 `cross-env` 支持, 设置生产环境和开发环境
* 配置新增 `cssnano` 支持, css 自动压缩和筛减
* 配置新增 `autoprefixer` 支持, css 自动添加浏览器兼容前缀
* 配置新增 `copy-webpack-plugin` 支持
* 配置新增 `friendly-errors-webpack-plugin` 支持
* 配置新增 `webpack.DllPlugin`, 优化编译速度, 缩小编译文件
* 配置优化 `output` 绝对路径改相对路径
* 配置优化 `bundle-loader` 的组件创造函数, 具体见 `src/component/Bundle.js`
* 常用 `cdn` 源推荐
	* [bootcdn](http://bootcdn.cn) 内容不全, 更新还算及时, 国内访问速度快
	* [cdnjs](https://cdnjs.com) 大而全, 更新迅速及时, 国内访问速度慢

## 刚开始学 webpack, 还有很多不懂, 欢迎指点秘籍, 或者纠错改进, 共同学习,共同进步

## 代码规范参考
* [js规范es5,es6,react](https://github.com/airbnb/javascript)
* [js规范中文版](https://github.com/yuche/javascript)
* [React规范中文版](https://github.com/JasonBoy/javascript/tree/master/react)
* [es5规范中文版](https://github.com/sivan/javascript-style-guide/tree/master/es5)
* [eslint规则](http://eslint.cn/docs/rules)
* [js标准化介绍](https://standardjs.com/readme-zhcn.html)
* [js标准化规则](https://standardjs.com/rules-zhcn.html)

## 个人代码习惯(因人而异,觉得不好的我会改,所以仅供参考)
### 关于文件末尾留一空行
* 我是不留的,能少一行为什么不少
### 关于代码缩进
* tab和空格争论不休:不追求html的attr换行对齐和css的冒号对齐,tab没什么不好;如果要追求对齐那还是空格吧
### 关于引号
* js统一双引号,字符串内的双引号统一`\"`,单引号`\x27`,双引号`\x22`,那样就找不到单引号了
* css统一双引号,content内容必须转义,防止偶尔的乱码
### 是否加逗号
* 原则上,行结尾的逗号,加不加逗号都不会有语法错误的情况,加逗号,方便整行移动时无视是否需要加逗号
* 习惯上,非行结尾的逗号,加不加逗号都不会有语法错误的情况,不加逗号
* 数组 如果内部换行,换行前必加逗号
* 对象 如果内部换行,换行前必加逗号
### 是否加分号
* 所有情况尽可能完整追加分号
### 关于定义变量
* 如果赋值,一个变量一条const或者let,不用var
* 如果可以,尽可能用对象或数组的解构形式进行赋值
### 关于import顺序
* 引入node_modules中的全局组件
* 引入node_modules中的非全局组件
* 凭借loader媒介加载的, 如:bundle-loader
* 自定义的一些组件
* 自定义的一些函数
* 引入图片文件
* 引入样式文件

## 更新 `package.json` 方法
* 在当前目录执行 `npm update -D -S`
* 还可以安装`npm i -g npm-check-updates`, 然后在当前目录执行 `ncu` 或 `ncu -a`

## 开发坏境启动
1. `npm i` 和 `npm ddp` 若在前面运行过此命令, 可跳过
2. `npm run dll` 若在前面运行过此命令, 可跳过
3. `npm start`
4. 浏览器打开[http://localhost:8888](http://localhost:8888)

## 生产坏境部署
1. `npm i` 和 `npm ddp` 若在前面运行过此命令, 可跳过
2. `npm run app`
3. 拷贝dist文件夹内容至服务器即可