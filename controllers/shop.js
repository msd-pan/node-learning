const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEM_PER_PAGE = 1;

exports.getProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;

    const totalItems = await Product.find().countDocuments();

    const products = await Product.find()
      .skip((page - 1) * ITEM_PER_PAGE)
      .limit(ITEM_PER_PAGE);

    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All products",
      path: "/products",
      currentPage: page,
      hasNextPage: ITEM_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);
    // method findById is also provided by mongoose
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;

    const totalItems = await Product.find().countDocuments();

    const products = await Product.find()
      .skip((page - 1) * ITEM_PER_PAGE)
      .limit(ITEM_PER_PAGE);

    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      currentPage: page,
      hasNextPage: ITEM_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const cartProducts = user.cart.items;
    // console.log(cartProducts);
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    // console.log(req.user);
    await req.user.addToCart(product);

    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await req.user.removeFromCart(prodId);

    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: { email: req.user.email, userId: req.user },
      products,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });

    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);
    if (!order) return next(new Error("No order found."));

    if (order.user.userId.toString() !== req.user._id.toString())
      return next(new Error("Unauthorized"));

    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);

    const pdfDoc = new PDFDocument();
    res.setHeader("Content-type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text("Invoice", { underline: true });
    pdfDoc.text("--------------------------");
    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          `${prod.product.title}-${prod.quantity}x $ ${prod.product.price}`
        );
    });
    pdfDoc.text("----");
    pdfDoc.fontSize(20).text(`Total Price: ${totalPrice}`);

    pdfDoc.end();

    // preloading data
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) return next(err);

    //   res.setHeader("Content-type", "application/pdf");
    //   res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
    //   res.send(data);
    // });

    // streaming data
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader("Content-type", "application/pdf");
    // res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
    // file.pipe(res);
  } catch (err) {
    next(err);
  }
};
