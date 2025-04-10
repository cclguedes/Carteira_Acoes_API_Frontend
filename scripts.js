// Busca a lista de ações na API e atualiza os cards na interface.
const getList = async () => {
  const url = 'http://127.0.0.1:5000/acoes';
  fetch(url, { method: 'get' })
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('cardsContainer');
      container.innerHTML = ''; // Limpa os cards atuais.

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

// Envia uma nova ação para a API (POST).
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

// Remove uma ação da base pelo ticker (DELETE).
const deleteItem = (ticker) => {
  const url = `http://127.0.0.1:5000/acao?ticker=${encodeURIComponent(ticker)}`;
  fetch(url, { method: 'delete' })
    .then(() => getList()) // Atualiza os cards após remover.
    .catch(error => {
      console.error('Erro ao remover ação:', error);
    });
};

// Cria e insere um card com os dados de uma ação.
const insertCard = (ticker, qtd, valor, valorAtual, valorTotal, valorizacao) => {
  const container = document.getElementById('cardsContainer');
  const card = document.createElement('div');
  card.className = 'card';

  const valorizacaoClass = valorizacao >= 0 ? 'valorizacao-positiva' : 'valorizacao-negativa';

  card.innerHTML = `
    <button class="remove-btn" onclick="deleteItem('${ticker}')">&times;</button>
    <h2>${ticker}</h2>
    <p><strong>Quantidade:</strong> ${qtd}</p>
    <p><strong>Preço Médio:</strong> R$ ${formatarValor(valor)}</p>
    <p><strong>Valor Atual:</strong> R$ ${formatarValor(valorAtual)}</p>
    <p><strong>Total Investido:</strong> R$ ${formatarValor(valorTotal)}</p>
    <p><strong>Valorização:</strong> <span class="${valorizacaoClass}">${formatarValor(valorizacao)}%</span></p>
  `;

  container.appendChild(card);
};

// Captura os dados do formulário e envia para a API.
const newItem = () => {
  const inputTicker = document.getElementById("newInput").value.trim().toUpperCase();
  const inputQtd = parseInt(document.getElementById("newQuantity").value);
  const inputValorBruto = document.getElementById("newPrice").value;
  const inputValor = parseFloat(inputValorBruto.replace(/\./g, '').replace(',', '.'));

  if (!inputTicker || isNaN(inputQtd) || isNaN(inputValor)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  postItem(inputTicker, inputQtd, inputValor);

  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";
};

// Aplica formatação pt-BR a um número.
const formatarValor = (numero) => {
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Aplica máscara ao campo de valor enquanto digita (pt-BR).
const aplicarMascaraMoeda = (element) => {
  // Permite apenas números e uma vírgula enquanto digita.
  element.addEventListener('input', (e) => {
    let valor = e.target.value;

    // Remove tudo que não for dígito ou vírgula.
    valor = valor.replace(/[^0-9,]/g, '');

    // Garante apenas uma vírgula.
    const partes = valor.split(',');
    if (partes.length > 2) {
      valor = partes[0] + ',' + partes[1];
    }

    e.target.value = valor;
  });

  // Formata corretamente ao sair do campo.
  element.addEventListener('blur', (e) => {
    let valor = e.target.value;

    if (!valor) return;

    const numero = parseFloat(valor.replace(/\./g, '').replace(',', '.'));

    if (!isNaN(numero)) {
      e.target.value = numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  });
};

// Inicia formatação automática do campo de preço.
document.addEventListener('DOMContentLoaded', () => {
  const inputValor = document.getElementById("newPrice");
  aplicarMascaraMoeda(inputValor);
  getList();
});
