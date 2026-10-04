const express = require('express');
const groceryController = require('../controllers/grocery.controller');
const groceryRouter  = express.Router();



groceryRouter.get("/grocery",groceryController);
module.exports = groceryRouter;