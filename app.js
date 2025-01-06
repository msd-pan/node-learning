// 引入Node.js核心模块 'path'，用于处理文件和目录路径
// Import Node.js core module 'path' for handling file and directory paths
const path = require("path");

// 引入安装的第三方模块 'express' 和 'body-parser'
// Import third-party modules 'express' and 'body-parser'
const express = require("express");
const bodyParser = require("body-parser");

// 引入自定义的错误控制器
// Import custom error controller
const errorController = require("./controllers/error");

const db = require("./util/database");

// 创建Express应用实例
// Create an Express application instance
const app = express();

// 设置模板引擎为 EJS
// Set the view engine to EJS
app.set("view engine", "ejs");

// 设置视图文件夹为 'views'
// Set the views directory to 'views'
app.set("views", "views");

// 引入自定义路由模块
// Import custom routing modules
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

db.execute("select * from products")
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

// 使用 body-parser 解析表单数据
// Use body-parser to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// 设置静态文件目录为 'public'
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// 将以 '/admin' 开头的路由交由 adminRoutes 处理
// Route requests starting with '/admin' to adminRoutes
app.use("/admin", adminRoutes);

// 将其他匹配的路由交由 shopRoutes 处理
// Route other requests to shopRoutes
app.use(shopRoutes);

// 使用错误控制器处理 404 错误（未找到页面）
// Use the error controller to handle 404 errors (Page Not Found)
app.use(errorController.get404);

// 启动服务器并监听 3000 端口
// Start the server and listen on port 3000
app.listen(3000, () => {
  // console.log("Server is running on http://localhost:3000");
});
