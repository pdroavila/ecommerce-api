const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidosController');

router.get('/pedidos', pedidosController.listarPedidos);
router.post('/pedidos', pedidosController.criarPedido);

// router.get('/produtos/storage/:id', produtosController.imagemProduto);
// router.get('/produtos/:id', produtosController.obterProdutoPorId);
// router.put('/produtos/:id', produtosController.atualizarProduto);
// router.delete('/produtos/:id', produtosController.removerProduto);

module.exports = router;
