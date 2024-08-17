// Importa o módulo Sequelize, que é um ORM (Object-Relational Mapping) para Node.js, utilizado para interagir com o banco de dados.
const Sequelize = require('sequelize');

// Cria uma nova instância do Sequelize para se conectar ao banco de dados MySQL.
// Os parâmetros passados são:
// 'taskagoravai' - Nome do banco de dados.
// 'root' - Nome de usuário do banco de dados.
// 'q98058787' - Senha do banco de dados.
// Um objeto de configuração, especificando o host (localhost) e o tipo de banco de dados (MySQL).
const sequelize = new Sequelize('taskagoravai', 'root', 'q98058787', {
  host: 'localhost',
  dialect: 'mysql'
});

// Tenta autenticar a conexão com o banco de dados usando as configurações fornecidas.
sequelize.authenticate()
  .then(() => {
    // Se a conexão for bem-sucedida, exibe uma mensagem no console.
    console.log('Conexão com o banco de dados foi estabelecida com sucesso.');
  })
  .catch(err => {
    // Se a conexão falhar, exibe um erro no console com a mensagem de erro.
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

// Exporta o módulo Sequelize e a instância sequelize para serem utilizados em outros arquivos do projeto.
module.exports = {
  Sequelize,
  sequelize
};
