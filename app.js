/**
 * ============================================================
 * app.js — Controlador principal
 * ============================================================
 *
 * Responsabilidades:
 * - Orquestrar fluxo entre telas (início → pergunta → resultado)
 * - Event delegation centralizado
 * - Transições entre componentes
 */

const App = (function () {
  /** @type {HTMLElement} */
  let root = null;

  /** @type {string|null} ID da pergunta atual */
  let perguntaAtual = null;

  /**
   * Renderiza HTML no container root com transição
   * @param {string} html
   */
  function renderizar(html) {
    root.classList.add("transicao-saida");

    setTimeout(() => {
      root.innerHTML = html;
      root.classList.remove("transicao-saida");
      root.classList.add("transicao-entrada");

      setTimeout(() => {
        root.classList.remove("transicao-entrada");
      }, 400);
    }, 200);
  }

  /**
   * Exibe a tela inicial
   */
  function telaInicio() {
    renderizar(Components.TelaInicio());
  }

  /**
   * Exibe uma pergunta
   * @param {string} id
   */
  function telaPergunta(id) {
    const pergunta = Engine.getPergunta(id);
    if (!pergunta) {
      console.error(`Pergunta "${id}" não encontrada`);
      return;
    }
    perguntaAtual = id;
    const estado = Engine.getEstado();
    renderizar(Components.TelaPergunta(pergunta, estado));
  }

  /**
   * Exibe o resultado final
   */
  function telaResultado() {
    const resultado = Engine.calcularFinal();
    renderizar(Components.TelaResultado(resultado));
  }

  /**
   * Processa a ação de responder
   * @param {HTMLElement} elemento
   */
  function handleResponder(elemento) {
    const perguntaId = elemento.dataset.pergunta;
    const index = parseInt(elemento.dataset.index, 10);

    // Feedback visual
    elemento.classList.add("resposta-selecionada");

    // Desabilitar todos os botões
    const botoes = root.querySelectorAll(".btn-resposta");
    botoes.forEach((btn) => (btn.disabled = true));

    setTimeout(() => {
      const resultado = Engine.responder(perguntaId, index);

      if (resultado.proximaId) {
        telaPergunta(resultado.proximaId);
      } else {
        telaResultado();
      }
    }, 600);
  }

  /**
   * Event delegation centralizado
   * @param {Event} event
   */
  function handleClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;

    switch (action) {
      case "iniciar":
        Engine.iniciar();
        telaPergunta(PERGUNTAS[0].id);
        break;

      case "responder":
        handleResponder(target);
        break;

      case "reiniciar":
        Engine.iniciar();
        telaInicio();
        break;
    }
  }

  /**
   * Inicializa a aplicação
   */
  function init() {
    root = document.getElementById("app");
    if (!root) {
      throw new Error('Elemento #app não encontrado');
    }

    // Event delegation no root
    root.addEventListener("click", handleClick);

    // Exibir tela inicial
    telaInicio();
  }

  // Iniciar quando DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { init };
})();
