const express = require('express');
const refreshController = require('../controllers/refresh.controller');
const refreshRouter = express.Router();

refreshRouter.post("/refresh",refreshController);
module.exports = refreshRouter