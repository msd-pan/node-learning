const mongoose = require("mongoose");

const Product = require("../models/product");

const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, price, description } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: { title, price, description },
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  // console.log("errors.array()", errors.array());

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: { title, price, description },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    // _id: new mongoose.Types.ObjectId("67a96ddfc27e2af6340636e2"),
    title,
    price,
    imageUrl,
    description,
    userId: req.user, // this will only pass the user id,not the entire user
  });
  try {
    await product.save(); // this save method is provided by mongoose
    console.log("Created Product");
    res.redirect("/admin/products");
  } catch (err) {
    // return res.status(500).render("admin/edit-product", {
    //   pageTitle: "Add Product",
    //   path: "/admin/add-product",
    //   editing: false,
    //   hasError: true,
    //   product: { title, imageUrl, price, description },
    //   errorMessage: "Database operation failed, pls try again~",
    //   validationErrors: errors.array(),
    // });

    // res.redirect("/500");
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);

    if (!product) {
      return res.redirect("/");
    }
    // throw new Error();
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      hasError: false,
      product,
      errorMessage: null,
      validationErrors: [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const image = req.file;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("errors.array()", errors.array());
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        hasError: true,
        product: { title, price, description, _id: productId },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const product = await Product.findById(productId);

    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }
    // 直接修改字段
    product.title = title;
    product.price = price;
    product.description = description;

    if (image) product.imageUrl = image.path;

    await product.save();
    console.log("PRODUCT UPDATED!");
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id });

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
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await Product.deleteOne({ id: prodId, userId: req.user._id });
    console.log("PRODUCT DELETED!");
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
