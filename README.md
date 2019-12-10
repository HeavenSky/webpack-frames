### Badge
* [check](https://eslint.cn) && [format](https://prettier.io)
![](https://img.shields.io/npm/v/eslint.svg?label=eslint)
![](https://img.shields.io/npm/v/prettier.svg?label=prettier)
* [webpack1-ie8](webpack1-ie8)
![](https://img.shields.io/npm/v/webpack/legacy.svg?label=webpack)
![](https://img.shields.io/static/v1.svg?label=react&message=v0.14.9&color=blue)
![](https://img.shields.io/badge/antd-v1.11.6-blue.svg)
* [webpack3-react](webpack3-react)
![](https://img.shields.io/npm/v/webpack/webpack-3.svg?label=webpack)
![](https://img.shields.io/npm/v/react.svg?label=react)
![](https://img.shields.io/npm/v/antd.svg?label=antd)
* [webpack3-vue](webpack3-vue)
![](https://img.shields.io/npm/v/webpack/webpack-3.svg?label=webpack)
![](https://img.shields.io/npm/v/vue.svg?label=vue)
![](https://img.shields.io/npm/v/element-ui.svg?label=element-ui)
* [webpack4-react](webpack4-react)
![](https://img.shields.io/npm/v/webpack.svg?label=webpack)
![](https://img.shields.io/npm/v/react.svg?label=react)
![](https://img.shields.io/npm/v/antd.svg?label=antd)
* [webpack4-vue](webpack4-vue)
![](https://img.shields.io/npm/v/webpack.svg?label=webpack)
![](https://img.shields.io/npm/v/vue.svg?label=vue)
![](https://img.shields.io/npm/v/element-ui.svg?label=element-ui)

### 更新说明
1. `webpack4-vue`和`webpack3-vue`包含的文件夹完全一致
2. `webpack4-react`和`webpack3-react`包含的文件夹完全一致
3. 考虑到一致就没有在代码中再复制一份了,若有需要请自行拷贝
4. 开发环境已经做了热重载,若想开发环境兼容ie11以下,请清除热重载
	* 文件`.babelrc`的`plugins`中移除`react-hot-loader/babel`
	* `package.json`的`devDependencies`中移除`react-hot-loader`
	* `config/opt.dev.js`中`devServer.inline`必须为false(vue只需修改这一处)
	* 代码中移除`react-hot-loader`
5. 开发环境已经支持前端`mock api`,会自动读取`src/mock`下的文件,并进行热更新,代码逻辑在`config/mock.js`, 其中有`example`示例
6. `vue`和`vue-template-compiler`版本必须完全一致,否则有不可预见错误
7. `config`目录`webapck134,react,vue`配置已统一,不同项目仅需改`opt.self.js`即可
8. `readme`说明有遗漏,麻烦移驾到文件中看代码注释,关键点在`config`目录中的文件均有注释和官方参考文档地址
9. `devDependencies`被用来放锁版本的依赖了,`dependencies`是保持最新的依赖;由于不用发布到npm上,因此这个分类比较随意,甚至说是错误的;若要发布,请做好区分,具体细节谷歌百度找文档
10. 由于`DllPlugin`和`CommonsChunkPlugin或splitChunks`存在功能重复,而且前者需前置执行一次webpack命令,另外可以用`externals`来简单替代,后者可操作的空间大,可以自由拆包,使文件大小更均匀,故后续将不再使用`DllPlugin`

### 环境准备工作
1. 设置淘宝镜像 `npm config set registry https://registry.npm.taobao.org`
2. 管理员身份运行 `npm i -g npminstall`
3. 命令行进入当前目录,运行 `npminstall -c`
4. 若出现报错,常用解决办法如下:
	* 管理员身份运行`npm cache clean -f`和`npm cache verify -f`
	* 删除`node_modules`目录
	* 重新运行`npminstall -c`
	* 最后换一个好点的网络,升级`node`和`npm`
5. 使用注意:
	* `npminstall -c`和`npm install`不兼容,前者比后者快很多,但是不能混着用
	* 切换使用需要删除`node_modules`文件夹
	* `node-v12.0.0`有问题请先别升级,`node-v12`的最新版已经没有问题
	* 偶尔出现莫名其妙的打包错误或代码错误,删除`node_modules`重试

### 开发坏境启动
1. `npm start`
	* 需要支持 ie 时请用
	* `npm run env -- FOR_IE=1 npm start`
2. 浏览器打开 http://localhost:8888

### 生产坏境部署
1. `npm run app`
	* 需要支持 ie 时请用
	* `npm run env -- FOR_IE=1 npm run app`
2. 拷贝 dist 文件夹内容至服务器即可

### 新增其它功能
1. `npm run report` 查看生产包 bundle 组成
	* 需要支持 ie 时请用
	* `npm run env -- FOR_IE=1 npm run report`
2. `npm run debug` 新增断点调式启动,端口 7777
	* 需要支持 ie 时请用
	* `npm run env -- FOR_IE=1 npm run debug`

### 更新 package.json
* 安装`npm i -g npm-check-updates`
* 在`package.json`目录执行`ncu`(查看) `ncu -u`(更新)

### 使用 react-hot-loader 热重载
[官方文档](https://github.com/gaearon/react-hot-loader)
1. `package.json`的`devDependencies`中加入`react-hot-loader`
2. `webpack.cfg.dev.js`的`devServer.inline`一定要为`true`
3. `.babelrc`的`plugins`中加入`react-hot-loader/babel`
4. 启动命令增加`--hot`, 勿同时使用`HotModuleReplacementPlugin`
5. `export`根组件加修饰,并且在`react`前引入`react-hot-loader`
```js
import { hot } from 'react-hot-loader';
export default hot(module)(App);
```
注: 仅4.3.12支持`ie8+react@0`,且需要一个小变更,已在脚本内完成

### 图片处理
* 普通图片 => https://tinypng.com `图片压缩` => `url-loader`(4kb以下)
* svg图片 => https://github.com/svg/svgo `svg压缩` => `svg-url-loader`
```js
// 建议4kb以下使用,较大文件建议用file-loader
const src = require("!svg-url-loader?noquotes!./x.svg");
```

### webpack 3 4 支持 ie8 研究
1. DllPlugin 打包后的代码未经过转换, 极大可能存在不兼容问题, 因此打包速度无法较大提升
2. hot reload 原理是 Object.defineProperty, ie8 不支持
3. 无法使用最新 react/antd, react@0.x/antd@1.x 才支持 ie8; vue直接就不支持ie8
4. 至此 webpack 3 4 的一些优势近乎都不支持, 暂不考虑 webpack 3 4, 而且网上版本的兼容性都不是很好
5. 如果实在想用 webpack 3 4 兼容 ie8, 以下一些提供参考, 但未做测试(应该是都有问题)
	* https://github.com/ediblecode/webpack4-ie8
	* https://github.com/natural-fe/natural-cli/blob/master/ie8-mvvm.md

### 代码规范参考
* http://eslint.cn/docs/rules `eslint规则文档`
* https://github.com/yuche/javascript `js规范中文版`
* https://github.com/airbnb/javascript `js规范es5,es6,react`
* https://github.com/JasonBoy/javascript/tree/master/react `react规范中文版`
* https://github.com/sivan/javascript-style-guide/tree/master/es5 `es5规范中文版`
* 常用`esling`配置 `eslint-config-egg` `eslint-config-react-app` `eslint-config-ali`

### 个人代码习惯(因人而异,选择你认为对的,仅供参考)

#### 关于文件末尾留一空行
* 个人按照习惯来, 团队开发通过自动`eslint --fix`来统一

#### 关于代码缩进
* 个人按照习惯来, 团队开发通过自动`eslint --fix`来统一
* tab和空格争论不休:不追求html的attr换行对齐和css的冒号对齐,tab没什么不好;如果要追求对齐那还是空格吧

#### 关于引号
* js统一双引号,字符串内的双引号统一`\"`,单引号`\x27`,双引号`\x22`,那样就统一双引号了
* css统一双引号,content内容必须转义,防止出现乱码
* css/less/scss,很多时候可以用双引号代替单引号,而且某些情况下单引号编译时会有问题,另外html标签也是用双引号,正好都统一双引号了

#### 是否加逗号
* 如果没有语法错误, 那就加上吧, 那样改动的diff也会少点

#### 是否加分号
* 如果没有语法错误, 那就加上吧, 那样改动的diff也会少点

#### 关于定义变量
* 如果是单独定义,一个变量一行,优先const,使用let而不用var
* 如果可以,尽可能用对象或数组的解构形式进行赋值

#### 关于import顺序
* 最优先引入polyfill, React/Vue次之
* 其次是模块目录(node_modules)内, 优先模块路径深度排序, 依次按照(组件>函数>常量)分类和排序
* 然后是凭借loader媒介加载的, 如:promise-loader
* 再就是是开发目录(dev_dir)的, 依次按照(组件>函数>常量)分类和排序
* 引入样式文件, 依次按照(node_modules>dev_dir)分类和排序
* 引入图片文件, 依次按照(node_modules>dev_dir)分类和排序