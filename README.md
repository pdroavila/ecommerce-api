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
   Por padrão, será criado um usuário com e-mail `teste@gmail.com` e senha `teste123`.

5. **Executar Servidor API**

   Após configurar o banco de dados e as variáveis de ambiente, você pode executar o servidor API utilizando o Node.js:
   ```bash
     node app.js

## Documentação das Rotas da API

  A documentação das rotas pode ser encontrada aqui: https://documenter.getpostman.com/view/34583697/2sA3e49ovj