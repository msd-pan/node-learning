const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);
// 动态路由，匹配 /products/ 后接任何动态参数的路径, 其必须是放在最后，不然之前的任意/products/都不会达到
// Dynamic route, matches any route starting with /products/ followed by a dynamic parameter

// router.get("/cart", shopController.getCart);

// router.post("/cart", shopController.postCart);

// router.post("/cart-delete-item", shopController.postCartDeleteProduct);

// router.post("/create-order", shopController.postOrder);

// router.get("/orders", shopController.getOrders);

module.exports = router;
