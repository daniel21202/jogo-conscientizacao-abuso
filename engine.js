/**
 * ============================================================
 * engine.js — Motor do jogo
 * ============================================================
 *
 * Responsabilidades:
 * - Gerenciar estado (pontuação + histórico)
 * - Processar respostas
 * - Calcular próxima pergunta via regras declarativas
 * - Determinar o final
 */

const Engine = (function () {
  /** @type {{ pontosBons: number, pontosRuins: number, historico: Array }} */
  let estado = null;

  /**
   * Inicializa/reseta o estado do jogo
   */
  function iniciar() {
    estado = {
      pontosBons: 0,
      pontosRuins: 0,
      historico: [],
    };
    return estado;
  }

  /**
   * Retorna o estado atual (cópia)
   */
  function getEstado() {
    return { ...estado, historico: [...estado.historico] };
  }

  /**
   * Busca uma pergunta pelo ID
   * @param {string} id
   * @returns {object|null}
   */
  function getPergunta(id) {
    return PERGUNTAS.find((p) => p.id === id) || null;
  }

  /**
   * Avalia uma condição declarativa contra o estado atual
   * @param {{ campo: string, operador: string, valor: number }} condicao
   * @returns {boolean}
   */
  function avaliarCondicao(condicao) {
    if (!condicao) return true;
    const valorAtual = estado[condicao.campo];
    switch (condicao.operador) {
      case ">=":
        return valorAtual >= condicao.valor;
      case ">":
        return valorAtual > condicao.valor;
      case "<=":
        return valorAtual <= condicao.valor;
      case "<":
        return valorAtual < condicao.valor;
      case "==":
        return valorAtual === condicao.valor;
      default:
        return false;
    }
  }

  /**
   * Calcula a próxima pergunta com base nas regras e estado
   * @param {object} pergunta
   * @returns {string|null} ID da próxima pergunta ou null (fim)
   */
  function calcularProxima(pergunta) {
    if (pergunta.final) return null;

    for (const regra of pergunta.regrasProxima) {
      if (avaliarCondicao(regra)) {
        return regra.proxima;
      }
    }

    return pergunta.padrao || null;
  }

  /**
   * Processa a resposta do jogador
   * @param {string} perguntaId
   * @param {number} respostaIndex
   * @returns {{ proximaId: string|null, estado: object }}
   */
  function responder(perguntaId, respostaIndex) {
    const pergunta = getPergunta(perguntaId);
    if (!pergunta) throw new Error(`Pergunta "${perguntaId}" não encontrada`);

    const resposta = pergunta.respostas[respostaIndex];
    if (!resposta) throw new Error(`Resposta index ${respostaIndex} inválida`);

    // Acumular pontos
    if (resposta.tipo === "boa") {
      estado.pontosBons += resposta.pontos;
    } else {
      estado.pontosRuins += resposta.pontos;
    }

    // Registrar no histórico
    estado.historico.push({
      perguntaId: pergunta.id,
      perguntaTexto: pergunta.texto,
      respostaTexto: resposta.texto,
      tipo: resposta.tipo,
      pontos: resposta.pontos,
      pontosBonsAcumulados: estado.pontosBons,
      pontosRuinsAcumulados: estado.pontosRuins,
    });

    const proximaId = calcularProxima(pergunta);

    return {
      proximaId,
      estado: getEstado(),
    };
  }

  /**
   * Calcula o final do jogo com base nos pontos acumulados
   * @returns {object} Objeto do final (de FINAIS)
   */
  function calcularFinal() {
    for (const final of FINAIS) {
      if (avaliarCondicao(final.condicao)) {
        return { ...final, estado: getEstado() };
      }
    }
    // Último item (neutro) sempre serve como fallback
    const fallback = FINAIS[FINAIS.length - 1];
    return { ...fallback, estado: getEstado() };
  }

  return {
    iniciar,
    getEstado,
    getPergunta,
    responder,
    calcularFinal,
  };
})();
