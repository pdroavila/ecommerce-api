require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const produtosRoutes = require('./routes/produtosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');

const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/api', produtosRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', pedidosRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno do servidor');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
