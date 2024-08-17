// Obtém referências aos elementos HTML do formulário, entrada de texto e área de tarefas
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");

// Adiciona um listener para o evento de envio do formulário
form.addEventListener("submit", (e) => {
  // Impede o comportamento padrão do formulário (envio e recarregamento da página)
  e.preventDefault();

  // Obtém o valor do campo de entrada
  const value = input.value;

  // Se o campo de entrada estiver vazio, não faz nada
  if (!value) return;

  // Cria um novo elemento de parágrafo para a nova tarefa
  const newTask = document.createElement("p");
  newTask.classList.add("task"); // Adiciona a classe CSS 'task' ao novo elemento
  newTask.setAttribute("draggable", "true"); // Define o atributo de arrastar (drag) como verdadeiro
  newTask.innerText = value; // Define o texto do elemento como o valor da entrada

  // Adiciona um listener para o evento de início do arrasto
  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging"); // Adiciona a classe CSS 'is-dragging' quando a tarefa é arrastada
  });

  // Adiciona um listener para o evento de término do arrasto
  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging"); // Remove a classe CSS 'is-dragging' quando o arrasto é concluído
  });

  // Adiciona o novo elemento de tarefa à área de tarefas
  todoLane.appendChild(newTask);

  // Limpa o campo de entrada após adicionar a tarefa
  input.value = "";
});

// Envia uma solicitação POST para a API para adicionar uma nova tarefa ao servidor
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
  },
  body: JSON.stringify({
    nome: inputTask, // Nome da tarefa (deve ser substituído por uma variável ou valor apropriado)
    dia: inputDate  // Data da tarefa (deve ser substituído por uma variável ou valor apropriado)
  })
});
