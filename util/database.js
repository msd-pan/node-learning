const { Sequelize } = require("sequelize");
// use { Sequelize } instead of Sequelize to Activate NodeJS Sequelize Intellisense VS Code

const sequelize = new Sequelize("node-complete", "root", "msd123456", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
