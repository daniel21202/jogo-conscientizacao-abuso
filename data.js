/**
 * ============================================================
 * 
 * data.js — Dados do jogo (perguntas, respostas, regras)
 * ============================================================
 *
 * ESTRUTURA DE PERGUNTA:
 * {
 *   id: string          — Identificador único (ex: "1A", "2B", "3C")
 *   sequencia: number   — Número da pergunta na árvore
 *   texto: string       — Texto da pergunta exibido ao jogador
 *   respostas: Array<{
 *     texto: string     — Texto da opção
 *     tipo: "boa"|"ruim" — Classificação da resposta
 *     pontos: number    — Pontos atribuídos
 *   }>
 *   regrasProxima: Array<{
 *     campo: "pontosBons"|"pontosRuins" — Campo avaliado
 *     operador: ">=" | ">" | "<=" | "<" | "==" — Comparador
 *     valor: number     — Valor de comparação
 *     proxima: string   — ID da próxima pergunta
 *   }>
 *   padrao: string|null — ID da próxima pergunta se nenhuma regra bater (fallback)
 *   final: boolean      — Se true, é a última pergunta (encerra o jogo)
 * }
 *
 * REGRAS DE NAVEGAÇÃO:
 * - As regras são avaliadas em ordem (primeira que bate, vence)
 * - Se nenhuma regra bater, usa o campo "padrao"
 * - Se "final: true", não avalia regras — vai direto para o resultado
 *
 * RESULTADO FINAL:
 * - Calculado com base nos pontos acumulados ao final do jogo
 * - Configurável via FINAIS
/**
 * ============================================================
 * data.js — Dados do jogo (perguntas, respostas, regras)
 * ============================================================
 *
 * LÓGICA SIMPLIFICADA:
 * - Resposta boa = +1 ponto bom
 * - Resposta ruim = +1 ponto ruim
 * - Navegação depende de qual pontuação está maior
 */

const PERGUNTAS = [
  {
    id: "1A",
    sequencia: 1,
    texto: "Você conhece Lucas e descobre que ele é seu vizinho. Ele pergunta sobre o bairro. O que você faz?",
    respostas: [
      { texto: "Você responde bem, com interesse, e inicia uma conversa.", tipo: "boa", pontos: 1 },
      { texto: "Você responde sem muito entusiasmo.", tipo: "ruim", pontos: 1 },
      { texto: "Ignorar Lucas completamete ", tipo: "otimo", pontos: 10 },
    ],
    regrasProxima: [
      { campo: "pontosOtimos", operador: ">=", valor: 10, proxima: "FINAL" }, // sem proxima
      { campo: "pontosBons", operador: ">", valor: 0, proxima: "2A" },
      { campo: "pontosRuins", operador: ">", valor: 0, proxima: "2B" },
    ],
    padrao: "2A",
    final: false,
  },

  {
    id: "2A",
    sequencia: 2,
    texto: "Lucas começa a te mandar mensagens repetidamente perguntando onde você está. O que você faz?",
    respostas: [
      { texto: "Responde normalmente.", tipo: "ruim", pontos: 1 },
      { texto: "Diz que não gosta de ser controlada.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 1, proxima: "3A" },
      { campo: "pontosRuins", operador: ">", valor: 0, proxima: "3B" },
    ],
    padrao: "3B",
    final: false,
  },

  {
    id: "2B",
    sequencia: 2,
    texto: "Lucas começa a te mandar mensagens repetidamente perguntando onde você está. O que você faz?",
    respostas: [
      { texto: "Diz que isso não é da conta dele.", tipo: "boa", pontos: 1 },
      { texto: "Pergunta por que ele quer saber onde você está.", tipo: "ruim", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 0, proxima: "3A" },
      { campo: "pontosRuins", operador: ">", valor: 1, proxima: "3B" },
    ],
    padrao: "3A",
    final: false,
  },

  {
    id: "3A",
    sequencia: 3,
    texto: "Lucas pergunta muitas vezes com quem você estava andando. O que você faz?",
    respostas: [
      { texto: "Explica tudo para evitar discussão.", tipo: "ruim", pontos: 1 },
      { texto: "Diz que isso é um assunto pessoal.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 1, proxima: "4A" },
      { campo: "pontosRuins", operador: ">", valor: 1, proxima: "4B" },
    ],
    padrao: "4A",
    final: false,
  },

  {
    id: "3B",
    sequencia: 3,
    texto: "Lucas pergunta muitas vezes com quem você estava andando. O que você faz?",
    respostas: [
      { texto: "Explica tudo para evitar discussão.", tipo: "ruim", pontos: 1 },
      { texto: "Ignora o que ele está perguntando.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 1, proxima: "4A" },
      { campo: "pontosRuins", operador: ">", valor: 1, proxima: "4B" },
    ],
    padrao: "4A",
    final: false,
  },

  {
    id: "4A",
    sequencia: 4,
    texto: "Lucas diz que não gosta de alguns dos seus amigos. O que você faz?",
    respostas: [
      { texto: "Para de sair com eles para evitar discussão.", tipo: "ruim", pontos: 1 },
      { texto: "Continua saindo com seus amigos.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 2, proxima: "5A" },
      { campo: "pontosRuins", operador: ">", valor: 2, proxima: "5B" },
    ],
    padrao: "5A",
    final: false,
  },

  {
    id: "4B",
    sequencia: 4,
    texto: "Lucas diz que não gosta de alguns dos seus amigos. O que você faz?",
    respostas: [
      { texto: "Evita sair com seus amigos para evitar problemas.", tipo: "ruim", pontos: 1 },
      { texto: "Sai com eles mesmo assim.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 2, proxima: "5A" },
      { campo: "pontosRuins", operador: ">", valor: 2, proxima: "5B" },
    ],
    padrao: "5B",
    final: false,
  },

  {
    id: "5A",
    sequencia: 5,
    texto: "Em uma discussão Lucas levanta a voz contra você. O que você faz?",
    respostas: [
      { texto: "Fica calada para evitar briga.", tipo: "ruim", pontos: 1 },
      { texto: "Pede para ele falar com respeito.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 3, proxima: "6A" },
      { campo: "pontosRuins", operador: ">", valor: 3, proxima: "6B" },
    ],
    padrao: "6A",
    final: false,
  },

  {
    id: "5B",
    sequencia: 5,
    texto: "Em uma discussão Lucas levanta a voz contra você. O que você faz?",
    respostas: [
      { texto: "Fica calada para evitar briga.", tipo: "ruim", pontos: 1 },
      { texto: "Se afasta por um momento.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 3, proxima: "6A" },
      { campo: "pontosRuins", operador: ">", valor: 3, proxima: "6B" },
    ],
    padrao: "6B",
    final: false,
  },

  {
    id: "6A",
    sequencia: 6,
    texto: "Lucas pega seu celular para ver suas mensagens. O que você faz?",
    respostas: [
      { texto: "Pega o celular de volta e diz que sua privacidade deve ser respeitada.", tipo: "boa", pontos: 1 },
      { texto: "Acredita que é normal.", tipo: "ruim", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 4, proxima: "7A" },
      { campo: "pontosRuins", operador: ">", valor: 4, proxima: "7B" },
    ],
    padrao: "7A",
    final: false,
  },

  {
    id: "6B",
    sequencia: 6,
    texto: "Lucas pega seu celular para ver suas mensagens. O que você faz?",
    respostas: [
      { texto: "Diz que ele não pode mexer no seu celular sem pedir.", tipo: "boa", pontos: 1 },
      { texto: "Deixa ele mexer no celular.", tipo: "ruim", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 4, proxima: "7A" },
      { campo: "pontosRuins", operador: ">", valor: 4, proxima: "7B" },
    ],
    padrao: "7B",
    final: false,
  },

  {
    id: "7A",
    sequencia: 7,
    texto: "Ele começa a decidir onde vocês vão e o que vão fazer. Como você reage?",
    respostas: [
      { texto: "Deixa ele decidir.", tipo: "ruim", pontos: 1 },
      { texto: "Diz que quer participar das decisões.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 5, proxima: "8A" },
      { campo: "pontosRuins", operador: ">", valor: 5, proxima: "8B" },
    ],
    padrao: "8A",
    final: false,
  },

  {
    id: "7B",
    sequencia: 7,
    texto: "Ele começa a decidir onde vocês vão e o que vão fazer. Como você reage?",
    respostas: [
      { texto: "Aceita para evitar discussões.", tipo: "ruim", pontos: 1 },
      { texto: "Faz o que quer mesmo assim.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 5, proxima: "8A" },
      { campo: "pontosRuins", operador: ">", valor: 5, proxima: "8B" },
    ],
    padrao: "8B",
    final: false,
  },

  {
    id: "8A",
    sequencia: 8,
    texto: "Lucas começa a te xingar em uma discussão. O que você faz?",
    respostas: [
      { texto: "Diz que não aceita ser tratada assim.", tipo: "boa", pontos: 1 },
      { texto: "Continua a discussão sem ligar para isso.", tipo: "ruim", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 6, proxima: "9A" },
      { campo: "pontosRuins", operador: ">", valor: 6, proxima: "9B" },
    ],
    padrao: "9A",
    final: false,
  },

  {
    id: "8B",
    sequencia: 8,
    texto: "Lucas começa a te xingar em uma discussão. O que você faz?",
    respostas: [
      { texto: "Diz que isso não está certo.", tipo: "boa", pontos: 1 },
      { texto: "Ignora completamente.", tipo: "ruim", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 6, proxima: "9A" },
      { campo: "pontosRuins", operador: ">", valor: 6, proxima: "9B" },
    ],
    padrao: "9B",
    final: false,
  },

  {
    id: "9A",
    sequencia: 9,
    texto: "Lucas começa a ser muito controlador. O que você faz?",
    respostas: [
      { texto: "Deixa porque acha que é amor.", tipo: "ruim", pontos: 1 },
      { texto: "Tem uma conversa sincera.", tipo: "boa", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 7, proxima: "10A" },
      { campo: "pontosRuins", operador: ">", valor: 7, proxima: "10B" },
    ],
    padrao: "10A",
    final: false,
  },

  {
    id: "9B",
    sequencia: 9,
    texto: "Lucas começa a ser muito controlador. O que você faz?",
    respostas: [
      { texto: "Tenta se afastar cada vez mais.", tipo: "boa", pontos: 1 },
      { texto: "Finge que está tudo bem.", tipo: "ruim", pontos: 1 },
    ],
    regrasProxima: [
      { campo: "pontosBons", operador: ">", valor: 7, proxima: "10A" },
      { campo: "pontosRuins", operador: ">", valor: 7, proxima: "10B" },
    ],
    padrao: "10B",
    final: false,
  },

  {
    id: "10A",
    sequencia: 10,
    texto: "Depois de refletir muito você percebe que o relacionamento não está saudável. O que decide?",
    respostas: [
      { texto: "Continuar o namoro.", tipo: "ruim", pontos: 1 },
      { texto: "Terminar o relacionamento e seguir sua vida.", tipo: "boa", pontos: 1 },
    ],
    final: true,
  },

  {
    id: "10B",
    sequencia: 10,
    texto: "Depois de refletir muito você percebe que o relacionamento não está saudável. O que decide?",
    respostas: [
      { texto: "Continuar o namoro.", tipo: "ruim", pontos: 1 },
      { texto: "Ir embora e terminar o relacionamento.", tipo: "boa", pontos: 1 },
    ],
    final: true,
  }
]


const FINAIS = [
  {
    id: "otimo",
    titulo: "final Ótimo",
    descricao: "Por  não ter dado chance de Lucas falar com você não ouve abuso",
    condicao: { campo: "pontosOtimos", operador: ">=", valor: 10 },
    classe: "final-bom"
  },
  {
    id: "bom",
    titulo: "Final Bom",
    descricao: "Você percebeu os sinais de controle e decidiu terminar o relacionamento. Com apoio de amigos e pessoas próximas, segue sua vida em paz e com mais consciência sobre relacionamentos saudáveis.",
    condicao: { campo: "pontosBons", operador: ">=", valor: 6 },
    classe: "final-bom",
  },
  {
    id: "ruim",
    titulo: "Final Ruim",
    descricao: "Ao ignorar vários sinais de abuso, o relacionamento se torna cada vez mais perigoso. Essa história serve como alerta para reconhecer comportamentos abusivos.",
    condicao: { campo: "pontosRuins", operador: ">=", valor: 6 },
    classe: "final-ruim",
  },
  {
    id: "neutro",
    titulo: "Final Neutro",
    descricao: "Você percebe alguns sinais de que algo não está certo no relacionamento, mas ainda precisa refletir mais e buscar apoio para tomar uma decisão.",
    condicao: null,
    classe: "final-neutro",
  },
];
//  git config --global user.name "daniel21202"
//  git config --global user.email "danisa2129daniel@gmail.com"