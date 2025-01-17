const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = async (callback) => {
  try {
    await MongoClient.connect(
      "mongodb+srv://xiaoka:kjnDrVAOaVXZdbQk@cluster0.0bsg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected!!");
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoConnect;
