const express = require('express');
const stripeRouter = express.Router();
const stripeController = require("../controllers/stripe.controller");
const authenticateToken = require('../middleware/auth.middleware');


stripeRouter.post("/create-checkout-session",authenticateToken,stripeController.stripePayment);
stripeRouter.get("/product/:type",stripeController.productType);

module.exports = stripeRouter;