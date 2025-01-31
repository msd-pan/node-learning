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
      const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
      });

      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];

      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: new ObjectId(product._id),
          quantity: newQuantity,
        });
      }

      const updatedCart = {
        items: updatedCartItems,
      };
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
