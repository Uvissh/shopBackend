const express = require('express');
const animalController = require('../controllers/animal.controller');
const  animalRouter  = express.Router();


animalRouter.get('/animal',animalController)

module.exports = animalRouter;