// Busca a lista de ações na API e atualiza os cards na interface.
const getList = async () => {
  const url = 'http://127.0.0.1:5000/acoes';
  fetch(url, { method: 'get' })
    .then(response => response.json())
    .then(data => {
      // Limpa os cards atuais.
      const container = document.getElementById('cardsContainer');
      container.innerHTML = '';
      // Insere um card para cada ação retornada.
      data.acoes.forEach(acao => {
        insertCard(
          acao.ticker,
          acao.qtd,
          acao.valor,
          acao.valor_atual,
          acao.valor_total,
          acao.valorizacao
        );
      });
    })
    .catch(error => {
      console.error('Erro ao carregar ações:', error);
    });
};

// Envia uma nova ação para a API (método POST) e atualiza a lista.
const postItem = async (ticker, qtd, valor) => {
  const formData = new FormData();
  formData.append('ticker', ticker);
  formData.append('qtd', qtd);
  formData.append('valor', valor);

  const url = 'http://127.0.0.1:5000/acao';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then(() => getList()) // Atualiza os cards após adicionar.
    .catch(error => {
      console.error('Erro ao adicionar ação:', error);
    });
};

// Remove uma ação da base pelo ticker (método DELETE).
const deleteItem = (ticker) => {
  const url = `http://127.0.0.1:5000/acao?ticker=${encodeURIComponent(ticker)}`;
  fetch(url, { method: 'delete' })
    .then(() => getList()) // Atualiza os cards após remover.
    .catch(error => {
      console.error('Erro ao remover ação:', error);
    });
};

// Cria e insere um card com os dados de uma ação no container principal.
const insertCard = (ticker, qtd, valor, valorAtual, valorTotal, valorizacao) => {
  const container = document.getElementById('cardsContainer');
  const card = document.createElement('div');
  card.className = 'card';

  // Aplica cor diferente dependendo se a valorização é positiva ou negativa.
  const valorizacaoClass = valorizacao >= 0 ? 'valorizacao-positiva' : 'valorizacao-negativa';

  // Define o conteúdo HTML do card.
  card.innerHTML = `
    <button class="remove-btn" onclick="deleteItem('${ticker}')">&times;</button>
    <h2>${ticker}</h2>
    <p><strong>Quantidade:</strong> ${qtd}</p>
    <p><strong>Preço Médio:</strong> R$ ${valor.toFixed(2)}</p>
    <p><strong>Valor Atual:</strong> R$ ${valorAtual.toFixed(2)}</p>
    <p><strong>Total Investido:</strong> R$ ${valorTotal.toFixed(2)}</p>
    <p><strong>Valorização:</strong> <span class="${valorizacaoClass}">${valorizacao.toFixed(2)}%</span></p>
  `;

  // Adiciona o card ao container.
  container.appendChild(card);
};

// Captura os dados do formulário e envia para a API.
const newItem = () => {
  const inputTicker = document.getElementById("newInput").value.trim().toUpperCase();
  const inputQtd = parseInt(document.getElementById("newQuantity").value);
  const inputValor = parseFloat(document.getElementById("newPrice").value);

  // Validação básica dos campos.
  if (!inputTicker || isNaN(inputQtd) || isNaN(inputValor)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  // Envia os dados para a API.
  postItem(inputTicker, inputQtd, inputValor);

  // Limpa os campos do formulário após envio.
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";
};

// Carrega a lista de ações ao carregar a página.
getList();
