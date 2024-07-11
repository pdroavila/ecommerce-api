const mysql = require('mysql');
const connection = require('../config/mysqlConnection');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateAccessToken(user) {
  return jwt.sign(user, process.env.DECRYPT_HASH); // Token sem expiração
}

function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.DECRYPT_HASH);
    return decoded; 
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

const usuariosController = {
  listarUsuarios: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403); 

    connection.query('SELECT * FROM usuarios', (err, results) => {
      if (err) {
        console.error('Erro ao listar usuários:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      res.json(results);
    });
  },

  obterUsuarioPorId: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403); 
    
    const { id } = req.params;
    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Erro ao obter usuário por ID:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      res.json(results[0]);
    });
  },

  registrarUsuario: (req, res) => {
    const { nome, email, senha, admin = false } = req.body;

    connection.query('SELECT email FROM usuarios where email = ?', [email], (err, result) => {
      if(err){
        res.status(500).json({ error: 'Erro interno do servidor', "error": err });
        return;
      }

      if(result.length){
        res.status(404).json({ error: 'E-mail já cadastrado!' });
        return;
      }

      const timeStamp = new Date().getTime();
      const hash = generateAccessToken({timeStamp, email, senha, admin });
  
      connection.query('INSERT INTO usuarios (nome, email, senha, hash) VALUES (?, ?, ?, ?)', [nome, email, crypto.createHash('md5').update(senha).digest('hex'), hash], (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Erro interno do servidor', err });
          return;
        }
        const novoUsuario = { hash };
        res.status(201).json(novoUsuario);
      });
    })
  },

  atualizarUsuario: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403); 

    const { id } = req.params;
    const { nome, email, senha } = req.body;
    connection.query('UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?', [nome, email, crypto.createHash('md5').update(senha).digest('hex'), id], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    });
  },

  desativarUsuario: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403); 

    const { id } = req.params;
    connection.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Erro ao desativar usuário:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      res.status(204).send();
    });
  },

  buscarUsuarioPorEmailESenha: (req, res) => {
    const { email, senha } = req.body;
    connection.query('SELECT * FROM usuarios WHERE email = ? and senha = ?', [email, crypto.createHash('md5').update(senha).digest('hex')], (err, results) => {
      if (err) {
        console.error('Erro ao obter usuário por ID:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      res.json(results[0]);
    });
  },
  
  buscarUsuarioPorHash: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403); 

    connection.query('SELECT * FROM usuarios WHERE hash = ? and email = ? and senha = ?', [token, decodedToken.email,  crypto.createHash('md5').update(decodedToken.senha).digest('hex')], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      res.json({"admin": results[0].admin});
    });
  }
};

module.exports = usuariosController;
