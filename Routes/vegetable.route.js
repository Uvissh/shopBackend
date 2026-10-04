const express = require('express');
const vegetableController = require('../controllers/vegetable.controller');
const vegetableRouter  = express.Router();


vegetableRouter.get("/vegetable",vegetableController);
 module.exports = vegetableRouter;