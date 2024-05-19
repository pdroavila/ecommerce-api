const express = require('express');
const router = express.Router();

const produtosController = require('../controllers/produtosController');

router.get('/produtos', produtosController.listarProdutos);
router.post('/produtos', produtosController.criarProduto);
router.get('/produtos/storage/:id', produtosController.imagemProduto);
router.get('/produtos/:id', produtosController.obterProdutoPorId);
router.put('/produtos/:id', produtosController.atualizarProduto);
router.delete('/produtos/:id', produtosController.removerProduto);

module.exports = router;
