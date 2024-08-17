// Função assíncrona para adicionar uma nova tarefa
async function addTask() {
  // Obtém os valores dos campos de entrada
  const nome = document.getElementById('inputTask').value;
  const dia = document.getElementById('inputDate').value;

  // Verifica se todos os campos estão preenchidos
  if (!nome || !dia) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  try {
    // Envia uma solicitação POST para o servidor para adicionar a nova tarefa
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nome,
        dia: dia,
      }),
    });

    // Verifica se a resposta do servidor é bem-sucedida
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao adicionar tarefa:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Converte a resposta do servidor para JSON
    const data = await response.json();
    if (data.success) {
      alert('Tarefa adicionada com sucesso!');

      // Cria um novo item de lista
      var newTask = document.createElement("li");
      newTask.classList.add("task");
      newTask.setAttribute("data-date", dia);
      newTask.style.listStyle = "none";

      // Cria um checkbox para a tarefa
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", function() {
        // Marca a tarefa como concluída se o checkbox estiver marcado
        if (this.checked) {
          newTask.classList.add("completed");
        } else {
          newTask.classList.remove("completed");
        }
      });

      // Cria um elemento de texto para exibir o nome e a data da tarefa
      var taskText = document.createElement("span");
      taskText.textContent = nome + " | Data de conclusão: " + dia;
      taskText.style.fontSize = "1rem";
      taskText.style.fontWeight = "bold";
      taskText.style.marginInline = "20px";

      // Cria um botão para exibir detalhes da tarefa
      var detailsButton = document.createElement("button");
      detailsButton.textContent = "Detalhes";
      detailsButton.addEventListener("click", function() {
        exibirModal(nome, dia);
      });

      // Cria um botão de remoção com SVG
      var removeButton = document.createElement("button");
      removeButton.classList.add("btn", "btn-succes");
      removeButton.style.marginLeft = "5px";  // Adiciona a margem à esquerda
      removeButton.setAttribute("aria-label", "Excluir tarefa");
      removeButton.innerHTML = `
        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      removeButton.addEventListener("click", function() {
        removeTask(data.taskId, newTask);
      });

      // Adiciona os elementos ao novo item da lista
      newTask.appendChild(checkbox);
      newTask.appendChild(taskText);
      newTask.appendChild(detailsButton);
      newTask.appendChild(removeButton);

      // Define estilo do novo item da lista
      newTask.style.backgroundColor = "white";
      newTask.style.borderRadius = "60px";
      newTask.style.marginTop = "20px";

      // Encontra a lista e adiciona a nova tarefa
      var lista = document.getElementById("listTask");
      lista.appendChild(newTask);

      // Ordena a lista por data
      sortListByDate();

    } else {
      alert('Falha ao adicionar tarefa.');
    }
  } catch (error) {
    // Captura e exibe erros que ocorrem durante a execução da função
    console.error('Erro ao adicionar tarefa:', error);
    alert('Erro ao adicionar tarefa. Confira o console para mais detalhes.');
  }
}

// Função para carregar as tarefas quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
  // Função para buscar e carregar as tarefas do servidor
  function loadTasks() {
    fetch('/tasks')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          renderTasks(data.tasks);
        } else {
          console.error('Erro ao carregar tarefas:', data.message);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar tarefas:', error);
      });
  }

  // Função para renderizar as tarefas na página
  function renderTasks(tasks) {
    // Obtém o template Handlebars
    const source = document.getElementById('task-template').innerHTML;
    const template = Handlebars.compile(source);
    // Compila o template com as tarefas e insere na lista
    const html = template({ tarefas: tasks });
    document.getElementById('listTask').innerHTML = html;
  }

  // Carrega as tarefas ao carregar a página
  loadTasks();
});

// Função para atualizar a altura da lista de tarefas
function updateListHeight() {
  const list = document.getElementById("listTask");
  list.style.height = 'auto';
}

// Função para ordenar a lista de tarefas por data
function sortListByDate() {
  const list = document.getElementById("listTask");
  const items = Array.from(list.getElementsByTagName("li"));
  items.sort((a, b) => {
    const dateA = new Date(a.getAttribute("data-date"));
    const dateB = new Date(b.getAttribute("data-date"));
    return dateA - dateB;
  });
  // Limpa a lista e adiciona os itens ordenados
  list.innerHTML = "";
  items.forEach(item => list.appendChild(item));
}

// Função para alternar o status de conclusão de uma tarefa
async function toggleTask(taskId, isChecked) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: isChecked,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao atualizar tarefa:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      console.log('Tarefa atualizada com sucesso!');
    } else {
      alert('Falha ao atualizar tarefa.');
    }
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    alert('Erro ao atualizar tarefa. Confira o console para mais detalhes.');
  }
}

// Função para remover uma tarefa
async function removeTask(taskId, taskElement) {
  console.log('ID da tarefa:', taskId);
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao remover tarefa:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      // Remove o elemento da tarefa da lista
      taskElement.remove();
      console.log('Tarefa removida com sucesso!');
    } else {
      alert('Falha ao remover tarefa.');
    }
  } catch (error) {
    console.error('Erro ao remover tarefa:', error);
    alert('Erro ao remover tarefa. Confira o console para mais detalhes.');
  }
}

// Função para exibir um modal com detalhes da tarefa
function exibirModal(taskTitle, taskDate) {
  document.getElementById('taskTitle').textContent = taskTitle;
  document.getElementById('taskDate').textContent = 'Data de conclusão: ' + taskDate;
  document.getElementById('taskModal').style.display = 'block';
}

// Função para fechar o modal de detalhes da tarefa
function fecharModalTask() {
  document.getElementById('taskModal').style.display = 'none';
}

// Função para salvar a descrição da tarefa e fechar o modal
function salvarDescricao() {
  alert('Descrição da tarefa salva!');
  fecharModalTask();
}

// Função para exibir os Termos de Uso
function exibirTermosDeUso() {
  const termosDeUso = "Termos de Uso - Site de Lista de Tarefas\n\n" +
    "1. Uso do Serviço:\n" +
    "   Nosso site de lista de tarefas é destinado ao uso pessoal e não comercial. Você concorda em usar nossos serviços apenas para fins legais e de acordo com estes Termos de Uso.\n\n" +
    "2. Registro:\n" +
    "   Alguns recursos do nosso site podem exigir registro. Ao se registrar, você concorda em fornecer informações verdadeiras, precisas e atualizadas. Você é responsável por manter a confidencialidade de suas credenciais de login.\n\n" +
    "3. Privacidade:\n" +
    "   Respeitamos a sua privacidade. Ao usar nosso site, você concorda com nossa Política de Privacidade, que descreve como coletamos, usamos e divulgamos suas informações.\n\n" +
    "4. Conteúdo do Usuário:\n" +
    "   Você é o único responsável por todo o conteúdo que você cria, publica, exibe ou compartilha em nosso site. Ao enviar conteúdo, você nos concede uma licença mundial, não exclusiva, livre de royalties, para usar, modificar, exibir e distribuir esse conteúdo em conexão com a operação do nosso site.\n\n";

  document.getElementById('termosDeUso').textContent = termosDeUso;
  document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal de Termos de Uso
function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

// Função para aceitar os Termos de Uso e fechar o modal
function aceitarTermos() {
  fecharModal();
}

// Função para recusar os Termos de Uso e fechar o modal
function recusarTermos() {
  fecharModal();
}

// Função para validar o formulário de cadastro
function validateForm() {
  let isValid = true;

  // Validar campo de nome de usuário
  const usernameInput = document.getElementById('validationServer01');
  if (usernameInput.value.trim() === '') {
    usernameInput.classList.remove('is-valid');
    usernameInput.classList.add('is-invalid');
    isValid = false;
  } else {
    usernameInput.classList.remove('is-invalid');
    usernameInput.classList.add('is-valid');
  }

  // Validar campo de nome
  const nameInput = document.getElementById('validationServerUsername');
  if (nameInput.value.trim() === '') {
    nameInput.classList.remove('is-valid');
    nameInput.classList.add('is-invalid');
    isValid = false;
  } else {
    nameInput.classList.remove('is-invalid');
    nameInput.classList.add('is-valid');
  }

  // Validar campo de email
  const emailInput = document.getElementById('validationServer03');
  if (emailInput.value.trim() === '') {
    emailInput.classList.remove('is-valid');
    emailInput.classList.add('is-invalid');
    isValid = false;
  } else {
    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');
  }

  // Validar campo de senha
  const passwordInput = document.getElementById('validationServerPassword');
  if (passwordInput.value.trim() === '') {
    passwordInput.classList.remove('is-valid');
    passwordInput.classList.add('is-invalid');
    isValid = false;
  } else {
    passwordInput.classList.remove('is-invalid');
    passwordInput.classList.add('is-valid');
  }

  // Validar checkbox de termos de uso
  const termsCheckbox = document.getElementById('invalidCheck3');
  if (!termsCheckbox.checked) {
    termsCheckbox.classList.add('is-invalid');
    isValid = false;
  } else {
    termsCheckbox.classList.remove('is-invalid');
  }

  return isValid;
}
