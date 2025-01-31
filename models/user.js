const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  async save() {
    try {
      const db = getDb();

      const result = await db.collection("users").insertOne(this);
    } catch (err) {
      console.log(err);
    }
  }

  async addToCart(product) {
    try {
      // const cartProduct = this.cart.items.findIndex((cp) => {
      //   return cp._id === product._id;
      // });

      const updatedCart = { items: [{ ...product, quantity: 1 }] };
      const db = getDb();
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: updatedCart } }
        );
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
