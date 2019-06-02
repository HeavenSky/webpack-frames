# 提前了解一下
部分重复的文档说明已经提取到上一级的目录的`README.md`, 如果有疑问请重点看一下

# webpack4-vue
* 采用 `vue` 和 `element-ui` 兼容到浏览器 `IE9` 的 `demo` 例子
* 所有 `dependency` 和 `dev dependency` 均采用最新版本, 具体请见 `package.json`

## 重要说明
* 文件夹 `webpack3-*/src` 和 `webpack4-*/src` 完全重复
* 如果缺失请自行拷贝一份, `vue` 和 `react` 的还是不一样的

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
5. 使用注意:
	- `npminstall -c`和`npm install`不兼容,前者比后者快很多,但是不能混着用
	- 切换使用需要删除`node_modules`文件夹
	- `node-v12.0.0`有问题请先别升级,`node-v12`的最新版已经没有问题

## 开发坏境启动
1. `npm run dll` 此前执行过,可跳过
2. `npm start`
3. 浏览器打开 http://localhost:8888

## 生产坏境部署
1. `npm run app`
2. 拷贝dist文件夹内容至服务器即可

## 刚开始学 webpack, 还有很多不懂, 欢迎指点秘籍, 或者纠错改进, 共同学习,共同进步