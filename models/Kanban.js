// Importa o módulo Sequelize e DataTypes, usados para definir o modelo e os tipos de dados.
const { Sequelize, DataTypes } = require('sequelize');

// Importa a instância de conexão 'sequelize' do arquivo 'db.js', assumindo que está na pasta raiz do projeto.
const db = require('./db');

// Importa o modelo 'Internauta', que representa a tabela de usuários no banco de dados.
const Internauta = require('./Internauta');

// Importa o modelo 'Tarefa', que representa a tabela de tarefas no banco de dados.
const Tarefa = require('./Tarefa');

// Define um modelo chamado 'Kanban', que representa uma tabela no banco de dados.
// Os campos da tabela são definidos como propriedades do objeto passado para 'define'.
const Kanban = db.sequelize.define('Kanban', {
  // Define a coluna 'num' como chave primária, do tipo INTEGER, com auto-incremento.
  num: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Define a coluna 'posicao' como STRING com um limite máximo de 8 caracteres.
  // A validação 'isIn' garante que o valor de 'posicao' deve ser uma das strings especificadas: 'fazer', 'fazendo', ou 'feito'.
  posicao: {
    type: DataTypes.STRING(8),
    validate: {
      isIn: [['fazer', 'fazendo', 'feito']]
    }
  },
  // Define a coluna 'idusuario' como INTEGER, que é uma chave estrangeira referenciando a coluna 'id' na tabela 'Internauta'.
  idusuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Internauta,
      key: 'id'
    }
  },
  // Define a coluna 'idtarefa' como INTEGER, que é uma chave estrangeira referenciando a coluna 'num' na tabela 'Tarefa'.
  idtarefa: {
    type: DataTypes.INTEGER,
    references: {
      model: Tarefa,
      key: 'num'
    }
  }
});

// Exporta o modelo 'Kanban' para que possa ser utilizado em outros arquivos do projeto.
module.exports = Kanban;
