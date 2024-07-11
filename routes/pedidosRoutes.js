const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidosController');

router.get('/pedidos', pedidosController.listarPedidos);
router.post('/pedidos', pedidosController.criarPedido);

module.exports = router;
