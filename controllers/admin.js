const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user, // this will only pass the user id,not the entire user
  });
  try {
    await product.save(); // this save method is provided by mongoose
    console.log("Created Product");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);

    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { prodId, title, imageUrl, price, description } = req.body;
  try {
    const product = await Product.findById(prodId);
    // 直接修改字段
    product.title = title;
    product.price = price;
    product.description = description;
    product.imageUrl = imageUrl;
    await product.save();
    console.log("PRODUCT UPDATED!");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    // const testProducts = await Product.find().select("title price -_id");
    // // The .select() method is used to specify which fields to retrieve from the database
    // // The "-_id" option ensures that the _id field is excluded from the query results (by default, MongoDB always includes _id)
    // console.log("testProducts", testProducts);

    // const testProducts1 = await Product.find()
    //   .select("title price -_id") //// Only retrieve title and price, exclude _id
    //   .populate("userId"); //// Replace `userId` with actual User document

    // console.log("testProducts", testProducts1);
    // // The .populate() method in Mongoose is used to replace a referenced ObjectId with the actual document from another collection. This is useful when working with MongoDB references (ref), where one document stores the ObjectId of another document instead of embedding the full data.

    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.prodId;
  try {
    await Product.findByIdAndDelete(prodId);
    console.log("PRODUCT DELETED!");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};
