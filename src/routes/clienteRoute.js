const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/addCliente', clienteController.insertCliente);
router.post('/deleteCliente',clienteController.deleteCliente);
router.get('/searchCliente',clienteController.searchCliente)
router.post('/searchClienteByPhone',clienteController.searchClientebyPhone)

module.exports = router;