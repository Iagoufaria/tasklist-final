// Seleciona todos os elementos com a classe "task" e "swim-lane"
const draggables = document.querySelectorAll(".task"); // Elementos que podem ser arrastados
const droppables = document.querySelectorAll(".swim-lane"); // Áreas onde os elementos podem ser soltos

// Adiciona listeners de eventos para cada elemento "task"
draggables.forEach((task) => {
  // Adiciona a classe "is-dragging" quando o elemento começa a ser arrastado
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
  });
  
  // Remove a classe "is-dragging" quando o elemento termina de ser arrastado
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });
});

// Adiciona listeners de eventos para cada zona de destino "swim-lane"
droppables.forEach((zone) => {
  // Permite que os itens sejam arrastados para dentro da zona
  zone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Impede o comportamento padrão para permitir o drop

    // Insere a tarefa arrastada acima da tarefa mais próxima na zona de destino
    const bottomTask = insertAboveTask(zone, e.clientY); // Encontra a tarefa mais próxima abaixo da posição do cursor
    const curTask = document.querySelector(".is-dragging"); // Obtém a tarefa que está sendo arrastada

    if (!bottomTask) {
      zone.appendChild(curTask); // Se não houver tarefa abaixo, adiciona a tarefa arrastada ao final da zona
    } else {
      zone.insertBefore(curTask, bottomTask); // Caso contrário, insere a tarefa antes da tarefa mais próxima
    }
  });
});

// Função para encontrar a tarefa mais próxima acima do cursor do mouse
const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)"); // Seleciona todas as tarefas, exceto a que está sendo arrastada

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect(); // Obtém a posição superior da tarefa em relação ao viewport

    const offset = mouseY - top; // Calcula a distância do cursor ao topo da tarefa

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset; // Atualiza a tarefa mais próxima
      closestTask = task;
    }
  });

  return closestTask; // Retorna a tarefa mais próxima
};

// Verifica se a classe MobileNavbar já foi definida
if (typeof MobileNavbar === "undefined") {
  // Classe para criar um menu de navegação responsivo para dispositivos móveis
  class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
      this.mobileMenu = document.querySelector(mobileMenu); // Seleciona o menu móvel
      this.navList = document.querySelector(navList); // Seleciona a lista de navegação
      this.navLinks = document.querySelectorAll(navLinks); // Seleciona todos os links de navegação
      this.activeClass = "active"; // Classe para indicar o estado ativo

      this.handleClick = this.handleClick.bind(this); // Garante que o contexto de `this` seja preservado
    }

    // Anima os links do menu de navegação
    animateLinks() {
      this.navLinks.forEach((link, index) => {
        link.style.animation
          ? (link.style.animation = "")
          : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`);
      });
    }

    // Manipula o clique no menu de navegação
    handleClick() {
      this.navList.classList.toggle(this.activeClass); // Adiciona ou remove a classe 'active' na lista de navegação
      this.mobileMenu.classList.toggle(this.activeClass); // Adiciona ou remove a classe 'active' no menu móvel
      this.animateLinks(); // Anima os links do menu
    }

    // Adiciona evento de clique ao menu de navegação
    addClickEvent() {
      this.mobileMenu.addEventListener("click", this.handleClick); // Adiciona o evento de clique no menu móvel
    }

    // Inicializa o menu de navegação
    init() {
      if (this.mobileMenu) {
        this.addClickEvent(); // Adiciona o evento de clique se o menu existir
      }
      return this;
    }
  }
}
