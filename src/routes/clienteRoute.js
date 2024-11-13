const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { logger } = require('sequelize/lib/utils/logger');

router.post('/addCliente', clienteController.insertCliente);
router.post('/deleteCliente',clienteController.deleteCliente);
router.get('/searchCliente',clienteController.searchCliente)
router.post('/searchClienteByPhone',clienteController.searchClientebyPhone)
router.post('/login',clienteController.login)

module.exports = router;