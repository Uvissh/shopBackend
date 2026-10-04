const express = require("express");
const googleAuthController = require("../controllers/googleAuth.controller");
const googleRouter = express.Router();


googleRouter.get("/google/callback",googleAuthController.googleCallback);
googleRouter.get("/google",googleAuthController.googleLogin);


module.exports = googleRouter;