// 引入Node.js核心模块 'path'，用于处理文件和目录路径
// Import Node.js core module 'path' for handling file and directory paths
const path = require("path");

// 引入安装的第三方模块 'express' 和 'body-parser'
// Import third-party modules 'express' and 'body-parser'
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// 引入自定义的错误控制器
// Import custom error controller
const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://xiaoka:kjnDrVAOaVXZdbQk@cluster0.0bsg4.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

// 创建Express应用实例
// Create an Express application instance
const app = express();

const store = new MongoDBStore({ uri: MONGODB_URI, collection: "sessions" });

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
const authRoutes = require("./routes/auth");

// 使用 body-parser 解析表单数据
// Use body-parser to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// 设置静态文件目录为 'public'
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// use session
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    req.user = await User.findById(req.session.user._id);
    next();
  } catch (err) {
    console.log(err);
  }
});

// 将以 '/admin' 开头的路由交由 adminRoutes 处理
// Route requests starting with '/admin' to adminRoutes
app.use("/admin", adminRoutes);

// 将其他匹配的路由交由 shopRoutes 处理
// Route other requests to shopRoutes
app.use(shopRoutes);
app.use(authRoutes);

// 使用错误控制器处理 404 错误（未找到页面）
// Use the error controller to handle 404 errors (Page Not Found)
app.use(errorController.get404);

const satrtServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

satrtServer();
