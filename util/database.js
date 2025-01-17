const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://xiaoka:kjnDrVAOaVXZdbQk@cluster0.0bsg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected!!");
    _db = client.db("shop");
    callback();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found !";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
