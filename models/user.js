const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

const { ObjectId } = require("mongodb");

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

      await db.collection("users").insertOne(this);
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

  async getCart() {
    try {
      const db = getDb();
      const productIds = this.cart.items.map((i) => {
        return i.productId;
      });
      let products = await db
        .collection("products")
        .find({ _id: { $in: productIds } })
        .toArray();

      products = await products.map((p) => {
        return {
          ...p,
          quantity: this.cart.items.find((i) => {
            return i.productId.toString() === p._id.toString();
          }).quantity,
        };
      });

      return products;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteItemFromCart(productId) {
    try {
      if (!productId) {
        console.log("错误: 传入的 productId 为空!");
        return;
      }

      const productObjectId = new ObjectId(productId); // 确保转换为 ObjectId

      const updatedCartItems = this.cart.items.filter((item) => {
        return !item.productId.equals(productObjectId); // 用 .equals() 进行 ObjectId 比较
      });

      const db = getDb();
      const result = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: updatedCartItems } } }
        );

      console.log("数据库更新结果:", result);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async addOrder() {
    const db = getDb();

    try {
      const products = await this.getCart();
      const order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          username: this.username,
        },
      };
      await db.collection("orders").insertOne(order);

      this.cart = { items: [] };
      const result = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );

      console.log("数据库更新结果:", result);
    } catch (err) {
      console.log(err);
    }
  }

  async getOrders() {
    const db = getDb();
    try {
      return await db
        .collection("orders")
        .find({ "user._id": new ObjectId(this._id) })
        .toArray();
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
