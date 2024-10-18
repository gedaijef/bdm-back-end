const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/addCliente', clienteController.insertCliente);
router.post('/deleteCliente',clienteController.deleteCliente);
router.post('/searchCliente',clienteController.searchCliente)

module.exports = router;