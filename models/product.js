const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(id);
  }

  async save() {
    try {
      const db = getDb();
      let dbOp;
      if (this._id) {
        // update the product
        dbOp = db
          .collection("products")
          .updateOne({ _id: this._id }, { $set: this });
      } else {
        dbOp = db.collection("products").insertOne(this);
      }
      const result = await db.collection("products").insertOne(this);
      console.log("result", result);
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();

      const products = await db.collection("products").find().toArray();
      console.log(products);
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(prodId) {
    const db = getDb();

    try {
      const product = await db
        .collection("products")
        .findOne({ _id: new mongodb.ObjectId(prodId) });
      return product;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Product;
