const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;
class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  async save() {
    try {
      const db = getDb();

      const result = await db.collection("users").insertOne(this);
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(userId) {
    const db = getDb();

    try {
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(userId) });
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = User;
