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

## 刚开始学 webpack, 还有很多不懂, 欢迎指点秘籍, 或者纠错改进, 共同学习,共同进步