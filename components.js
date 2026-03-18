/**
 * ============================================================
 * components.js — Sistema de componentes vanilla
 * ============================================================
 *
 * Emula a lógica de componentes React sem framework:
 * - Cada componente é uma função que retorna HTML string
 * - Renderização via innerHTML no container
 * - Event delegation no root para evitar re-bindear listeners
 *
 * Componentes:
 * - TelaInicio()       — Tela de boas-vindas
 * - TelaPergunta(p)    — Exibe pergunta + opções
 * - TelaResultado(r)   — Exibe o final + histórico
 * - BarraPontuacao(e)  — Barra lateral de pontuação
 * - HistoricoItem(h)   — Item do histórico de respostas
 */

const Components = (function () {
  /**
   * Tela inicial
   */
  function TelaInicio() {
    return `
      <div class="tela tela-inicio" data-component="inicio">
        <div class="inicio-conteudo">
          <div class="inicio-icone">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" stroke="var(--cor-acento)" stroke-width="2" opacity="0.3"/>
              <path d="M35 25 L55 40 L35 55 Z" fill="var(--cor-acento)" opacity="0.8"/>
            </svg>
          </div>
          <h1 class="inicio-titulo">respeito<br>no<br>relacionamento</h1>
          <p class="inicio-subtitulo">Cada decisão define seu destino.<br>Não há volta.</p>
          <button class="btn btn-primario" data-action="iniciar">
            Começar Jornada
          </button>
        </div>
        <div class="inicio-rodape">
          <span class="inicio-info">10 perguntas &middot; múltiplos finais</span>
        </div>
      </div>
    `;
  }

  /**
   * Barra de pontuação
   * @param {object} estado
   * @param {number} sequenciaAtual
   */
  function BarraPontuacao(estado, sequenciaAtual) {
    const totalPerguntas = 10;
    const progresso = ((sequenciaAtual - 1) / totalPerguntas) * 100;

    return `
      <div class="barra-pontuacao" data-component="pontuacao">
        <div class="pontuacao-progresso">
          <div class="progresso-trilha">
            <div class="progresso-preenchimento" style="width: ${progresso}%"></div>
          </div>
          <span class="progresso-texto">Pergunta ${sequenciaAtual} de ${totalPerguntas}</span>
        </div>
        <div class="pontuacao-valores">
          <div class="pontuacao-item pontuacao-boa">
            <span class="pontuacao-label">Noção</span>
            <span class="pontuacao-numero">${estado.pontosBons}</span>
          </div>
          <div class="pontuacao-item pontuacao-ruim">
            <span class="pontuacao-label">Ilução</span>
            <span class="pontuacao-numero">${estado.pontosRuins}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Tela de pergunta
   * @param {object} pergunta
   * @param {object} estado
   */
  function TelaPergunta(pergunta, estado) {
    const opcoesHTML = pergunta.respostas
      .map(
        (r, i) => `
        <button class="btn-resposta" data-action="responder" data-pergunta="${pergunta.id}" data-index="${i}">
          <span class="resposta-indicador">${String.fromCharCode(65 + i)}</span>
          <span class="resposta-texto">${r.texto}</span>
        </button>
      `
      )
      .join("");

    return `
      <div class="tela tela-pergunta" data-component="pergunta">
        ${BarraPontuacao(estado, pergunta.sequencia)}
        <div class="pergunta-conteudo">
          <div class="pergunta-header">
            <span class="pergunta-tag">Pergunta ${pergunta.sequencia}</span>
            <span class="pergunta-id">${pergunta.id}</span>
          </div>
          <h2 class="pergunta-texto">${pergunta.texto}</h2>
          <div class="pergunta-opcoes">
            ${opcoesHTML}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Item do histórico
   * @param {object} item
   * @param {number} index
   */
  function HistoricoItem(item, index) {
    return `
      <div class="historico-item historico-${item.tipo}">
        <div class="historico-numero">${index + 1}</div>
        <div class="historico-detalhes">
          <p class="historico-pergunta">${item.perguntaTexto}</p>
          <p class="historico-resposta">${item.respostaTexto}</p>
        </div>
        <div class="historico-pontos">
          <span class="historico-badge historico-badge-${item.tipo}">
            ${item.tipo === "boa" ? "+" : ""}${item.pontos} ${item.tipo === "boa" ? "Noção." : "Ilução"}
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Tela de resultado final
   * @param {object} resultado — retorno de Engine.calcularFinal()
   */
  function TelaResultado(resultado) {
    const historicoHTML = resultado.estado.historico
      .map((item, i) => HistoricoItem(item, i))
      .join("");

    const iconeMap = {
      otimo:`<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="var(--cor-bom)" stroke-width="2"/><path d="M20 34 L28 42 L44 24" stroke="var(--cor-bom)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      bom: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="var(--cor-bom)" stroke-width="2"/><path d="M20 34 L28 42 L44 24" stroke="var(--cor-bom)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      ruim: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="var(--cor-ruim)" stroke-width="2"/><path d="M22 22 L42 42 M42 22 L22 42" stroke="var(--cor-ruim)" stroke-width="3" stroke-linecap="round"/></svg>`,
      neutro: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="var(--cor-neutro)" stroke-width="2"/><line x1="20" y1="36" x2="44" y2="36" stroke="var(--cor-neutro)" stroke-width="3" stroke-linecap="round"/></svg>`,
    };

    return `
      <div class="tela tela-resultado ${resultado.classe}" data-component="resultado">
        <div class="resultado-conteudo">
          <div class="resultado-icone">${iconeMap[resultado.id]}</div>
          <h1 class="resultado-titulo">${resultado.titulo}</h1>
          <p class="resultado-descricao">${resultado.descricao}</p>

          <div class="resultado-stats">
            <div class="stat stat-boa">
              <span class="stat-numero">${resultado.estado.pontosBons}</span>
              <span class="stat-label">Noção</span>
            </div>
            <div class="stat-separador"></div>
            <div class="stat stat-ruim">
              <span class="stat-numero">${resultado.estado.pontosRuins}</span>
              <span class="stat-label">Ilução</span>
            </div>
          </div>

          <div class="resultado-historico">
            <h3 class="historico-titulo">Suas Escolhas</h3>
            ${historicoHTML}
          </div>

          <button class="btn btn-primario" data-action="reiniciar">
            Jogar Novamente
          </button>
        </div>
      </div>
    `;
  }

  return {
    TelaInicio,
    TelaPergunta,
    TelaResultado,
    BarraPontuacao,
    HistoricoItem,
  };
})();
