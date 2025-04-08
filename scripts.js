const getList = async () => {
  const url = 'http://127.0.0.1:5000/acoes';
  fetch(url, { method: 'get' })
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('cardsContainer');
      container.innerHTML = '';
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
    .then(() => getList())
    .catch(error => {
      console.error('Erro ao adicionar ação:', error);
    });
};

const deleteItem = (ticker) => {
  const url = `http://127.0.0.1:5000/acao?ticker=${encodeURIComponent(ticker)}`;
  fetch(url, { method: 'delete' })
    .then(() => getList())
    .catch(error => {
      console.error('Erro ao remover ação:', error);
    });
};

const insertCard = (ticker, qtd, valor, valorAtual, valorTotal, valorizacao) => {
  const container = document.getElementById('cardsContainer');

  const card = document.createElement('div');
  card.className = 'card';

  // Define a classe para cor baseada na valorização
  const valorizacaoClass = valorizacao >= 0 ? 'valorizacao-positiva' : 'valorizacao-negativa';

  card.innerHTML = `
    <button class="remove-btn" onclick="deleteItem('${ticker}')">&times;</button>
    <h2>${ticker}</h2>
    <p><strong>Quantidade:</strong> ${qtd}</p>
    <p><strong>Preço Médio:</strong> R$ ${valor.toFixed(2)}</p>
    <p><strong>Valor Atual:</strong> R$ ${valorAtual.toFixed(2)}</p>
    <p><strong>Total Investido:</strong> R$ ${valorTotal.toFixed(2)}</p>
    <p><strong>Valorização:</strong> <span class="${valorizacaoClass}">${valorizacao.toFixed(2)}%</span></p>
  `;

  container.appendChild(card);
};

const newItem = () => {
  const inputTicker = document.getElementById("newInput").value.trim().toUpperCase();
  const inputQtd = parseInt(document.getElementById("newQuantity").value);
  const inputValor = parseFloat(document.getElementById("newPrice").value);

  if (!inputTicker || isNaN(inputQtd) || isNaN(inputValor)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  postItem(inputTicker, inputQtd, inputValor);

  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";
};

getList();
