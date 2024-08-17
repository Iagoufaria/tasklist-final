// Importa o módulo Sequelize e o DataTypes, que são utilizados para definir os tipos de dados das colunas no banco de dados.
const { Sequelize, DataTypes } = require('sequelize');

// Importa a instância de conexão 'sequelize' do arquivo 'db.js', assumindo que está na pasta raiz do projeto.
const db = require('./db'); 

// Define um modelo chamado 'Internauta', que representa uma tabela no banco de dados.
// Os campos da tabela são definidos como propriedades do objeto passado para 'define'.
const Internauta = db.sequelize.define('Internauta', {
  // Define a coluna 'id' como chave primária, do tipo INTEGER, com auto-incremento.
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Define a coluna 'nome' como STRING com um limite máximo de 50 caracteres.
  nome: {
    type: DataTypes.STRING(50)
  },
  // Define a coluna 'email' como STRING com um limite máximo de 200 caracteres.
  email: {
    type: DataTypes.STRING(200)
  },
  // Define a coluna 'usuario' como STRING com um limite máximo de 50 caracteres.
  usuario: {
    type: DataTypes.STRING(50)
  },
  // Define a coluna 'senha' como STRING com um limite máximo de 50 caracteres.
  senha: {
    type: DataTypes.STRING(50)
  }
});

/* 
// O código abaixo, se descomentado, sincroniza o modelo 'Internauta' com o banco de dados.
// Isso criará a tabela 'Internauta' com as colunas especificadas acima.
// 'force: true' recria a tabela sempre que o código é executado, o que pode ser útil em ambiente de desenvolvimento,
// mas deve ser usado com cuidado em produção, pois apaga os dados da tabela.
Internauta.sync({ force: true })
  .then(() => {
    console.log('Tabela de Usuários criada com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao sincronizar tabela de Usuários:', err);
  });
*/

// Exporta o modelo 'Internauta' para que possa ser utilizado em outros arquivos do projeto.
module.exports = Internauta;
