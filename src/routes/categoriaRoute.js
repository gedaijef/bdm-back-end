const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/listCategories', categoriaController.listCategories);

module.exports = router;