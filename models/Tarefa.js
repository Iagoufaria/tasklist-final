// Importa o módulo Sequelize e DataTypes, que são usados para definir o modelo e os tipos de dados.
const { Sequelize, DataTypes } = require('sequelize');

// Importa a instância de conexão 'sequelize' do arquivo 'db.js', assumindo que está na pasta raiz do projeto.
const db = require('./db');

// Importa o modelo 'Internauta', que representa a tabela de usuários no banco de dados.
const Internauta = require('./Internauta');

// Define um modelo chamado 'Tarefa', que representa uma tabela no banco de dados.
// Os campos da tabela são definidos como propriedades do objeto passado para 'define'.
const Tarefa = db.sequelize.define('Tarefa', {
  // Define a coluna 'num' como chave primária, do tipo INTEGER, com auto-incremento.
  num: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Define a coluna 'nome' como STRING com um limite máximo de 50 caracteres, que representa o nome da tarefa.
  nome: {
    type: DataTypes.STRING(50)
  },
  // Define a coluna 'dia' como DATE, que armazena a data em que a tarefa foi ou será realizada.
  dia: {
    type: DataTypes.DATE
  },
  // Define a coluna 'detalhes' como STRING com um limite máximo de 255 caracteres, usada para armazenar detalhes adicionais sobre a tarefa.
  detalhes: {
    type: DataTypes.STRING(255)
  },
  // Define a coluna 'realizado' como BOOLEAN, que indica se a tarefa foi concluída ou não, com valor padrão 'false'.
  realizado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Define a coluna 'idusuario' como INTEGER, que é uma chave estrangeira referenciando a coluna 'id' na tabela 'Internauta'.
  idusuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Internauta,
      key: 'id'
    }
  }
});

// Exporta o modelo 'Tarefa' para que possa ser utilizado em outros arquivos do projeto.
module.exports = Tarefa;
