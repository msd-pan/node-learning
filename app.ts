import express from "express";
// const express = require("express");

import todosRoutes from "./routes/todos";

const app = express();

app.use(todosRoutes);

app.listen(3000);
