const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');

router.get('/usuarios', usuariosController.listarUsuarios);
router.post('/usuarios', usuariosController.registrarUsuario);
router.post('/usuarios/buscar', usuariosController.buscarUsuarioPorEmailESenha);
router.post('/usuarios/buscar/hash', usuariosController.buscarUsuarioPorHash);
router.get('/usuarios/:id', usuariosController.obterUsuarioPorId);
router.put('/usuarios/:id', usuariosController.atualizarUsuario);
router.delete('/usuarios/:id', usuariosController.desativarUsuario);

module.exports = router;
