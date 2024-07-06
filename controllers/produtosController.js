const mysql = require('mysql');
const connection = require('../config/mysqlConnection');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.DECRYPT_HASH);
    return decoded; 
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

const produtosController = {
  listarProdutos: (req, res) => {
    connection.query('SELECT * FROM produtos', (err, results) => {
      if (err) {
        console.error('Erro ao listar produtos:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      
      results.map((result) => {
        result.imagem = `${process.env.BASE_URL}/api/produtos/storage/${result.id}`;
      })

      res.json(results);
    });
  },

  obterProdutoPorId: (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM produtos WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Erro ao obter produto por ID:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      results.map((result) => {
        result.imagem = `${process.env.BASE_URL}/api/produtos/storage/${result.id}`;
      })
      
      res.json(results[0]);
    });
  },

  criarProduto: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken || !decodedToken.admin) return res.sendStatus(403); //Precisa ser ADM para atualizar;

    const { nome, valor, descricao, base64Image} = req.body;
  
    const matches = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).send('Formato de imagem inválido.');
    }
  
    const imageType = matches[1];
    const imageData = matches[2];
 
    const fileName = Date.now() + '.' + imageType;
    const filePath = path.join(__dirname + '/../', 'uploads', fileName);

    // Converte a imagem base64 de volta para o formato binário e a salva no servidor
    fs.writeFile(filePath, imageData, 'base64', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor', e: err });
      }
      
      connection.query('INSERT INTO produtos (nome, descricao, valor, imagem) VALUES (?, ?, ?, ?)', [nome, descricao, valor, 'uploads/' + fileName], (err, result) => {
        if (err) {
          console.error('Erro ao criar produto:', err);
          res.status(500).json({ error: 'Erro interno do servidor' });
          return;
        }
    
        const novoProduto = { id: result.insertId, nome: nome, descricao: descricao, valor: valor };
        res.status(201).json(novoProduto);
      })
    });
  },

  atualizarProduto: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403);

    const { id } = req.params;
    const { nome, valor, descricao} = req.body;
    connection.query('UPDATE produtos SET nome = ?, descricao = ?, valor = ? WHERE id = ?', [nome, descricao, valor, id], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }
      res.status(200).json({ message: 'Produto atualizado com sucesso' });
    });
  },

  removerProduto: (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) return res.sendStatus(403);

    const { id } = req.params;
    connection.query('DELETE FROM produtos WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Erro ao remover produto:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }
      res.status(200).json({ message: 'Produto removido com sucesso' });
    });
  },

  imagemProduto: (req, res) => {
    const { id } = req.params;
    const imagesDir = path.join(__dirname + '/../');


    connection.query('SELECT * FROM produtos WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Erro ao obter produto por ID:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      res.sendFile(imagesDir + results[0]['imagem']);
    });
  }
};

module.exports = produtosController;
