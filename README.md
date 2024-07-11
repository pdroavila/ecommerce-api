# ecommerce-api

Projeto de API backend desenvolvido para complementar o projeto da disciplina de frameworks de frontend.

## Configuração do Ambiente

1. **Renomear Arquivo de Ambiente**

   Renomeie o arquivo `env` para `.env`. Este arquivo contém as variáveis de ambiente necessárias para configurar a aplicação.

   ```bash
   mv env .env

2. **Configurar Banco de Dados**

   Ajuste as configurações do banco de dados no arquivo .env conforme necessário. Certifique-se de preencher os seguintes campos com os valores apropriados para o seu banco de dados:

   ```bash
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

3. **Rode o script SQL**

   Rode o script presente no arquivo "dump.sql".

4. **Executar Servidor API**

   Após configurar o banco de dados e as variáveis de ambiente, você pode executar o servidor API utilizando o Node.js:
   ```bash
     node app.js

## Documentação das Rotas da API

### Para as rotas que exigem autenticação, deve ser enviado um Bearer Token, que é gerado durante a criação do usuário.

### Rotas de Usuários

#### `GET /usuarios`
- **Descrição**: Lista todos os usuários.
- **Controlador**: `usuariosController.listarUsuarios`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`

#### `POST /usuarios`
- **Descrição**: Registra um novo usuário.
- **Controlador**: `usuariosController.registrarUsuario`
- **Requer Autenticação**: Não
- **Corpo da Requisição**:
  - `nome` (string): Nome do usuário.
  - `email` (string): Email do usuário.
  - `senha` (string): Senha do usuário.
  - `admin` (boolean, opcional): Se o usuário é administrador.

#### `POST /usuarios/buscar`
- **Descrição**: Busca um usuário pelo email e senha.
- **Controlador**: `usuariosController.buscarUsuarioPorEmailESenha`
- **Requer Autenticação**: Não
- **Corpo da Requisição**:
  - `email` (string): Email do usuário.
  - `senha` (string): Senha do usuário.

#### `POST /usuarios/buscar/hash`
- **Descrição**: Busca um usuário pelo hash.
- **Controlador**: `usuariosController.buscarUsuarioPorHash`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`

#### `GET /usuarios/:id`
- **Descrição**: Obtém um usuário pelo ID.
- **Controlador**: `usuariosController.obterUsuarioPorId`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`

#### `PUT /usuarios/:id`
- **Descrição**: Atualiza as informações de um usuário pelo ID.
- **Controlador**: `usuariosController.atualizarUsuario`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`
- **Corpo da Requisição**:
  - `nome` (string): Nome do usuário.
  - `email` (string): Email do usuário.
  - `senha` (string): Senha do usuário.

#### `DELETE /usuarios/:id`
- **Descrição**: Desativa um usuário pelo ID.
- **Controlador**: `usuariosController.desativarUsuario`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`

### Rotas de Produtos

#### `GET /produtos`
- **Descrição**: Lista todos os produtos.
- **Controlador**: `produtosController.listarProdutos`
- **Requer Autenticação**: Não

#### `POST /produtos`
- **Descrição**: Cria um novo produto.
- **Controlador**: `produtosController.criarProduto`
- **Requer Autenticação**: Sim (deve ser um administrador)
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`
- **Corpo da Requisição**:
  - `nome` (string): Nome do produto.
  - `descricao` (string): Descrição do produto.
  - `valor` (number): Valor do produto.
  - `base64Image` (string): Imagem do produto em formato base64.

#### `GET /produtos/storage/:id`
- **Descrição**: Obtém a imagem de um produto pelo ID.
- **Controlador**: `produtosController.imagemProduto`
- **Requer Autenticação**: Não

#### `GET /produtos/:id`
- **Descrição**: Obtém um produto pelo ID.
- **Controlador**: `produtosController.obterProdutoPorId`
- **Requer Autenticação**: Não

#### `PUT /produtos/:id`
- **Descrição**: Atualiza as informações de um produto pelo ID.
- **Controlador**: `produtosController.atualizarProduto`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`
- **Corpo da Requisição**:
  - `nome` (string): Nome do produto.
  - `descricao` (string): Descrição do produto.
  - `valor` (number): Valor do produto.

#### `DELETE /produtos/:id`
- **Descrição**: Remove um produto pelo ID.
- **Controlador**: `produtosController.removerProduto`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`

### Rotas de Pedidos

#### `GET /pedidos`
- **Descrição**: Lista todos os pedidos do usuário autenticado.
- **Controlador**: `pedidosController.listarPedidos`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`

#### `POST /pedidos`
- **Descrição**: Cria um novo pedido para o usuário autenticado.
- **Controlador**: `pedidosController.criarPedido`
- **Requer Autenticação**: Sim
- **Cabeçalhos**:
  - `Authorization: Bearer <seu-token>`
- **Corpo da Requisição**:
  - `cartItems` (array): Lista de itens do carrinho.
  - `total` (number): Valor total do pedido.

