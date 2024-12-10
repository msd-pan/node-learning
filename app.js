const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const rootDir = require("./util/path");

const app = express();

app.set("view engine", "pug");
app.set("views", "views"); //seting the views folder explicitly, you don't have to if the views folder's name is views,otherwise it's necessary

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});
app.listen(3000);
