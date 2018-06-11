# 更新说明
1. 配置变化比较大, 几乎将可配置的内容全部提取到 `webpack.ini.js` 内, 基本统一了 `webpack1 webpack3 webpack4 react vue` 各种框架的配置, 对于 `webpack4-*/src` 因为和 `webpack3-*/src` 没有区别, 就不再拷贝一份代码到该目录了
2. `README.md` 将不再作更新(因为变化太多,改起来有点烦), 具体关键点在 `webapck.*.js` 中有注释和相对应官方文档地址参考
3. 检查和格式化代码, 在当前目录 `npm start`