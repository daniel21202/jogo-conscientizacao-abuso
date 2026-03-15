# Jornada das Escolhas — Quiz com Múltiplos Finais

Jogo de perguntas e respostas onde cada escolha acumula pontos de dois tipos (sabedoria e risco), e a combinação de pontos determina tanto a próxima pergunta quanto o final do jogo.

## Como funciona

### Fluxo do jogo

1. Jogador inicia na tela de boas-vindas
2. A primeira pergunta é sempre `1A`
3. Ao responder, os pontos são acumulados no tipo correspondente (`pontosBons` ou `pontosRuins`)
4. O motor avalia as regras de navegação da pergunta atual contra o estado acumulado
5. A primeira regra que satisfazer a condição define a próxima pergunta
6. Se nenhuma regra bater, usa o campo `padrao` como fallback
7. Se a pergunta for marcada como `final: true`, o jogo termina e calcula o resultado

### Sistema de pontuação

Cada resposta possui:

- `tipo`: `"boa"` ou `"ruim"` — define em qual acumulador os pontos entram
- `pontos`: valor numérico somado ao acumulador correspondente

O estado do jogo mantém:

```
{
  pontosBons: number,
  pontosRuins: number,
  historico: [{ perguntaId, perguntaTexto, respostaTexto, tipo, pontos, ... }]
}
```

### Navegação entre perguntas

As regras de navegação são declarativas (sem funções anônimas):

```
regrasProxima: [
  { campo: "pontosBons", operador: ">=", valor: 6, proxima: "3C" },
  { campo: "pontosRuins", operador: ">=", valor: 2, proxima: "3A" }
]
```

Operadores suportados: `>=`, `>`, `<=`, `<`, `==`.

As regras são avaliadas em ordem. Primeira que bater vence. Se nenhuma bater, o campo `padrao` é usado.

### Cálculo do final

Ao chegar em uma pergunta com `final: true`, o array `FINAIS` é avaliado na mesma lógica (condição declarativa, primeiro que bater vence). O último item deve ter `condicao: null` para servir como fallback.

## Arquitetura

### Estrutura de arquivos

```
quiz-game/
├── index.html          # Ponto de entrada
├── css/
│   └── styles.css      # Todos os estilos
├── js/
│   ├── data.js         # Perguntas, respostas, regras, finais
│   ├── engine.js       # Motor: estado, processamento, navegação
│   ├── components.js   # Funções que retornam HTML (padrão component)
│   └── app.js          # Controlador: orquestração e event delegation
└── README.md
```

### Padrão de componentes (sem framework)

O projeto simula a abordagem de componentes React usando vanilla JS:

- **Componentes como funções puras**: cada componente é uma função que recebe dados e retorna uma string HTML. Exemplo: `Components.TelaPergunta(pergunta, estado)` retorna o HTML completo da tela.
- **Renderização centralizada**: `App.renderizar(html)` substitui o conteúdo do container `#app` com transição.
- **Event delegation**: um único listener no `#app` captura todos os cliques. Botões usam `data-action` para identificar a ação e `data-*` para passar parâmetros.
- **Separação clara**: `data.js` (dados) → `engine.js` (lógica) → `components.js` (UI) → `app.js` (orquestração).

### Decisões técnicas

- **Regras declarativas** em vez de funções anônimas: permite serialização (salvar/restaurar estado via JSON) e facilita adição de novas perguntas sem escrever código.
- **Módulos via IIFE**: `Engine`, `Components` e `App` são módulos encapsulados. Não poluem o escopo global além do necessário.
- **Histórico completo**: cada entrada do histórico armazena o snapshot de pontos acumulados naquele momento, útil para debug e para exibir ao jogador.

## Como adicionar conteúdo

### Nova pergunta

Adicione um objeto ao array `PERGUNTAS` em `data.js`:

```javascript
{
  id: "4A",
  sequencia: 4,
  texto: "Texto da pergunta",
  respostas: [
    { texto: "Opção 1", tipo: "boa", pontos: 3 },
    { texto: "Opção 2", tipo: "ruim", pontos: 2 }
  ],
  regrasProxima: [
    { campo: "pontosBons", operador: ">=", valor: 10, proxima: "5A" }
  ],
  padrao: "5B",
  final: false
}
```

### Novo final

Adicione ao array `FINAIS` (antes do fallback neutro):

```javascript
{
  id: "secreto",
  titulo: "Final Secreto",
  descricao: "Descrição do final",
  condicao: { campo: "pontosBons", operador: ">=", valor: 15 },
  classe: "final-secreto"
}
```

Adicione os estilos correspondentes em `styles.css` para a classe `final-secreto`.

## Tecnologias

- HTML5, CSS3, JavaScript ES6+
- Zero dependências externas (exceto Google Fonts)
- Sem bundler, sem transpilação
