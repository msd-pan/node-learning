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
  const product = new Product(title, imageUrl, price, description);
  try {
    await product.save();
    console.log("Created Product");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

// exports.getEditProduct = async (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     res.redirect("/");
//   }
//   const prodId = req.params.productId;
//   try {
//     // find an item by it's primary key
//     // const product = await Product.findByPk(prodId);

//     // find products with user's id with where condition
//     const products = await req.user.getProducts({ where: { id: prodId } });
//     const product = products[0];

//     if (!product) {
//       return res.redirect("/");
//     }
//     res.render("admin/edit-product", {
//       pageTitle: "Edit Product",
//       path: "/admin/edit-product",
//       editing: editMode,
//       product,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.postEditProduct = async (req, res, next) => {
//   const { prodId, title, imageUrl, price, description } = req.body;
//   try {
//     const product = await Product.findByPk(prodId);
//     Object.assign(product, { title, imageUrl, price, description });
//     product.save();
//     console.log("PRODUCT UPDATED!");
//     res.redirect("/admin/products");
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log(err);
  }
};

// exports.postDeleteProduct = async (req, res, next) => {
//   const prodId = req.body.prodId;
//   try {
//     const product = await Product.findByPk(prodId);
//     await product.destroy();
//     console.log("PRODUCT DELETED!");
//     res.redirect("/admin/products");
//   } catch (err) {
//     console.log(err);
//   }
// };
