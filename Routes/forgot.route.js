const express = require('express');
const  forgotRouter = express.Router();
const forgotController = require("../controllers/forgot.controller");

forgotRouter.post("/forgot-password",forgotController.forgotPassword);
forgotRouter.patch("/reset-password/:token",forgotController.resetPassword);

module.exports = forgotRouter;


