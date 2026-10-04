const express = require('express');
const stationaryController = require('../controllers/stationary.controller');
const statinoaryRouter  = express.Router();


statinoaryRouter.get("/statinary",stationaryController);

module.exports = statinoaryRouter;
