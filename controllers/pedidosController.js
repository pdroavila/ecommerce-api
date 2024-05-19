const connection = require('../config/mysqlConnection');
const jwt = require('jsonwebtoken');
const secretKey = "senhaSuperSecreta";
const crypto = require('crypto');

function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded; 
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

const pedidosController = {
  listarPedidos: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403);
  
    connection.query('SELECT id FROM usuarios where email = ? and senha = ?', [decodedToken.email, crypto.createHash('md5').update(decodedToken.senha).digest('hex')] , (err, results) => {
      if(err){
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
    
      const userId = results[0].id;

      connection.query('SELECT * FROM pedidos where id_usuario = ?', [userId] ,(err, results) => {
        if (err) {
          console.error('Erro ao listar pedidos:', err);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
  
        res.json(results);
      });
    })
  },

  criarPedido: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403);

    const { cartItems, total} = req.body;
  
    connection.query('SELECT id FROM usuarios where email = ? and senha = ?', [decodedToken.email, crypto.createHash('md5').update(decodedToken.senha).digest('hex')] , (err, results) => {
      if(err){
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      if(!results)
        return res.status(400).json({error: 'Não foi possível localizar o usuário solicitante.'})

      const userId = results[0].id;

      connection.query('INSERT INTO pedidos SET id_usuario = ?, produtos = ?, total = ?', [userId, JSON.stringify(cartItems), total], (err, results) => {
        if(err){
          res.status(500).json({ error: 'Erro interno do servidor', e: err });
          return;
        }

        return res.status(201).json(cartItems)
      })
    })
  },
};

module.exports = pedidosController;
