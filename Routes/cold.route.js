const express = require('express');
const coldController = require('../controllers/cold.controller');
const coldRouter  = express.Router();


coldRouter.get('/cold',coldController)

module.exports = coldRouter;
