const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product({ title, price, description, imageUrl });
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
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
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
