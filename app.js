// Importa os módulos necessários
const express = require('express'); // Framework para criar o servidor
const app = express(); // Cria uma instância do aplicativo Express
const { engine } = require('express-handlebars'); // Motor de template Handlebars
const bodyParser = require('body-parser'); // Middleware para parsing do corpo das requisições
const Internauta = require('./models/Internauta'); // Modelo de usuário
const Tarefa = require('./models/Tarefa'); // Modelo de tarefa
const Kanban = require('./models/Kanban'); // Modelo de Kanban (não utilizado no código fornecido)
const db = require('./models/db'); // Configuração do banco de dados
const PORT = process.env.PORT || 3001; // Porta para o servidor

// Middleware para parsing JSON e URL-encoded
app.use(express.json()); // Permite o parsing de JSON no corpo das requisições
app.use(bodyParser.urlencoded({ extended: false })); // Permite o parsing de dados URL-encoded
app.use(bodyParser.json()); // Permite o parsing de JSON

// Configurar o Handlebars como o motor de templates
app.engine('handlebars', engine({ defaultLayout: 'main' })); // Define o layout padrão
app.set('view engine', 'handlebars'); // Define o motor de templates a ser utilizado

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public')); // Permite o acesso a arquivos estáticos (CSS, JS, imagens) da pasta 'public'

// ROTAS

// Rota principal - renderiza a página de login
app.get('/login', (req, res) => {
  res.render('login'); // Renderiza a view 'login'
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
  res.render('cadastro'); // Renderiza a view 'cadastro'
});

// Rota para cadastrar um novo usuário
app.post('/cadastro', async (req, res) => {
  const { nome, email, usuario, senha } = req.body; // Desestrutura os dados do corpo da requisição

  try {
    // Validação básica dos campos
    if (!nome || !email || !usuario || !senha) {
      return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se o email já está cadastrado
    const existingUser = await Internauta.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'O email já está cadastrado.' });
    }

    // Cria um novo usuário
    const newUser = await Internauta.create({ nome, email, usuario, senha });

    // Redireciona para a página de login após o cadastro bem-sucedido
    res.redirect('/login');
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.' });
  }
});

// Rota para renderizar a página de tarefas
app.get('/tarefas', async (req, res) => {
  try {
    // Busca todas as tarefas no banco de dados
    const tarefas = await Tarefa.findAll();

    // Renderiza a página de tarefas passando as tarefas como contexto
    res.render('tarefa', {
      tarefas: tarefas.map(tarefa => ({
        num: tarefa.num,
        nome: tarefa.nome,
        dia: tarefa.dia.toLocaleDateString('pt-BR', { // Formatação para a data
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        realizado: tarefa.realizado,
        detalhes: tarefa.detalhes
      }))
    });

  } catch (error) {
    console.error('Erro ao obter tarefas:', error);
    res.status(500).send('Erro ao obter tarefas.');
  }
});

// Rota para criar uma nova tarefa
app.post('/tasks', async (req, res) => {
  console.log('Corpo da solicitação:', req.body); // Adiciona isto para depuração

  try {
    const { nome, dia } = req.body;

    if (!nome || !dia) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios ausentes.' });
    }

    const newTask = await Tarefa.create({ nome, dia });
    res.status(201).json({ success: true, taskId: newTask.num });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar tarefa.' });
  }
});

// Rota para obter todas as tarefas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Tarefa.findAll();
    res.status(200).json({
      success: true,
      tasks: tasks.map(tarefa => ({
        id: tarefa.num,
        text: tarefa.nome,
        date: tarefa.dia,
        completed: tarefa.realizado
      }))
    });
  } catch (error) {
    console.error('Erro ao obter tarefas:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter tarefas.' });
  }
});

// Rota para obter uma tarefa específica
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Tarefa.findByPk(req.params.id);
    if (task) {
      res.status(200).json({ success: true, task });
    } else {
      res.status(404).json({ success: false, message: 'Tarefa não encontrada.' });
    }
  } catch (error) {
    console.error('Erro ao obter tarefa:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter tarefa.' });
  }
});

// Rota para atualizar uma tarefa
app.put('/tasks/:id', async (req, res) => {
  try {
    const { completed } = req.body;
    const [updated] = await Tarefa.update({ realizado: completed }, {
      where: { num: req.params.id }
    });

    if (updated) {
      res.status(200).json({ success: true, message: 'Tarefa atualizada.' });
    } else {
      res.status(404).json({ success: false, message: 'Tarefa não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar tarefa.' });
  }
});

// Rota para excluir uma tarefa
app.delete('/tasks/:id', async (req, res) => {
  try {
    const deleted = await Tarefa.destroy({
      where: { num: req.params.id }
    });

    if (deleted) {
      res.status(200).json({ success: true, message: 'Tarefa excluída.' });
    } else {
      res.status(404).json({ success: false, message: 'Tarefa não encontrada.' });
    }
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir tarefa.' });
  }
});

// Rota para renderizar o Kanban
app.get('/kanbam', (req, res) => {
  res.render('kanbam'); // Renderiza a view 'kanbam'
});

// Rota para renderizar a página sobre
app.get('/about', (req, res) => {
  res.render('sobre'); // Renderiza a view 'sobre'
});

// Rota para o login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Buscar o usuário pelo email
    const usuario = await Internauta.findOne({ where: { email } });

    // Verificar se o usuário foi encontrado e se a senha está correta
    if (usuario && usuario.senha === senha) {
      // Redirecionar para a rota /tarefas
      res.redirect('/tarefas');
    } else {
      // Enviar mensagem de erro para o usuário
      res.send('Email ou senha incorretos');
    }
  } catch (err) {
    // Enviar mensagem de erro no caso de uma exceção
    res.status(500).send('Erro ao processar a solicitação');
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); // Mensagem de confirmação de que o servidor está rodando
});
