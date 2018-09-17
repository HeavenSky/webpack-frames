# 说明
文档内存在部分说明错误,请结合上一级目录的readme一起查看

# webpack4-react
采用 `React` 和 `Ant Design` 兼容到浏览器 `IE9` 的 `demo` 例子.
* 所有 `dependency` 和 `dev dependency` 均采用最新版本, 具体请见 `package.json`

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

## 重要说明
> 本目录没有`src`文件夹, 因为和`../webpack3-react/src`重复, 就没有复制一份代码到此目录, 因此需要手动拷贝一份`../webpack3-react/src`文件夹到此目录

## 开发坏境启动
1. `npm i` 和 `npm ddp` 若在前面运行过此命令, 可跳过
2. `npm run dll` 若在前面运行过此命令, 可跳过
3. `npm start`
4. 浏览器打开[http://localhost:8888](http://localhost:8888)

## 生产坏境部署
1. `npm i` 和 `npm ddp` 若在前面运行过此命令, 可跳过
2. `npm run app`
3. 拷贝dist文件夹内容至服务器即可