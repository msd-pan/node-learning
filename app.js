const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();

const MONGODB_URI =
  "mongodb+srv://xiaoka:kjnDrVAOaVXZdbQk@cluster0.0bsg4.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0";

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>

app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(3001);
  } catch (err) {
    console.log(err);
  }
};

startServer();
