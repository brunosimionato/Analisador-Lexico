var listaPalavras = [];

document.addEventListener("DOMContentLoaded", function () {
  configurarEventos();
});

function configurarEventos() {
  var botaoAdicionar = document.getElementById("adicionar");
  var botaoLimpar = document.getElementById("limpar");
  var inputAdicionar = document.getElementById("token");
  var validaPalavrainput = document.getElementById("validar-token");

  botaoAdicionar.addEventListener("click", adicionarPalavra);
  botaoLimpar.addEventListener("click", limpar);

  inputAdicionar.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      adicionarPalavra();
    }
  });

  validaPalavrainput.addEventListener("input", validaPalavra);
  validaPalavrainput.addEventListener("keyup", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      validaPalavra();
    }
  });
}

function exibirAviso(mensagem, isSucesso = true) {
  var warningContainer = document.getElementById("warningContainer");

  if (!warningContainer) {
    warningContainer = document.createElement("div");
    warningContainer.id = "warningContainer";
    warningContainer.style.position = "fixed";
    warningContainer.style.top = "20px";
    warningContainer.style.right = "20px";
    warningContainer.style.width = "300px";
    warningContainer.style.zIndex = "9999";
    document.body.appendChild(warningContainer);
  }

  var warningDiv = document.createElement("div");
  warningDiv.classList.add("warning");
  warningDiv.style.padding = "10px";
  warningDiv.style.marginTop = "10px";
  warningDiv.style.borderRadius = "5px";
  warningDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  warningDiv.style.color = "#fff";
  warningDiv.style.backgroundColor = isSucesso ? "#4caf50" : "#f44336";
  warningDiv.textContent = mensagem;

  warningContainer.appendChild(warningDiv);

  setTimeout(() => warningDiv.remove(), 5000);
}

function adicionarPalavra() {
  var palavra = document.getElementById("token").value.trim().toUpperCase();

  if (!validarPalavraInput(palavra)) return;

  exibePalavraNaTela(palavra);
  document.getElementById("token").value = "";
}

function validarPalavraInput(palavra) {
  if (palavra === "") {
    exibirAviso("Por favor, insira uma palavra.", false);
    return false;
  }

  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(palavra)) {
    exibirAviso("Por favor, insira apenas letras.", false);
    return false;
  }

  if (listaPalavras.includes(palavra)) {
    exibirAviso("Essa palavra já foi informada.", false);
    return false;
  }

  return true;
}

function exibePalavraNaTela(palavra) {
  listaPalavras.push(palavra);
  var divExibePalavras = document.querySelector(".palavras-adicionadas");

  var novoElemento = document.createElement("p");
  novoElemento.className = "palavra";
  novoElemento.innerText = palavra;
  divExibePalavras.appendChild(novoElemento);

  preencheTabela(palavra);
}

function preencheTabela(palavra) {
  var corpoTabela = document.getElementById("tbody");
  var letras = palavra.split("");

  letras.forEach((letra, j) => {
    var linha = criaOuAtualizaLinha(j, false, letras);
    if (!document.getElementById(`linha${j}`)) {
      corpoTabela.appendChild(linha);
    }
  });

  // Garantir que o estado final da palavra seja marcado
  var estadoFinal = letras.length;
  var linhaFinal = criaOuAtualizaLinha(estadoFinal, true, letras);

  // Atualizar ou adicionar a linha do estado final
  if (!document.getElementById(`linha${estadoFinal}`)) {
    corpoTabela.appendChild(linhaFinal);
  } else {
    var primeiraColuna = document.getElementById(`linha${estadoFinal}coluna0`);
    if (primeiraColuna && !primeiraColuna.textContent.endsWith("*")) {
      primeiraColuna.textContent += "*";
    }
  }
}


function criaOuAtualizaLinha(j, ultimaLetra, letras) {
  var linha = document.getElementById('linha' + j);
  if (!linha) {
    linha = document.createElement('tr');
    linha.id = 'linha' + j;
  }

  var primeiraColuna = document.getElementById('linha' + j + 'coluna0');
  if (!primeiraColuna) {
    primeiraColuna = document.createElement('td');
    primeiraColuna.id = 'linha' + j + 'coluna0';
    primeiraColuna.className = 'colunaLateral';
    linha.appendChild(primeiraColuna);
    primeiraColuna.textContent = 'q' + j + (ultimaLetra ? '*' : '');
  }

  for (var i = 65; i <= 90; i++) {
    var letra = String.fromCharCode(i);
    var colunaId = `coluna${i}linha${j}`;
    var coluna = document.getElementById(colunaId) || document.createElement("td");

    coluna.id = colunaId;
    coluna.className = "coluna";

    if (letras[j] === letra && !ultimaLetra && !coluna.textContent) {
      coluna.textContent = `q${j + 1}`;
    } else if (!coluna.textContent) {
      coluna.textContent = "";
    }

    if (!document.getElementById(colunaId)) {
      linha.appendChild(coluna);
    }
  }

  return linha;
}

function validaPalavra() {
  var campoInput = document.getElementById("validar-token");
  var palavra = campoInput.value.trim().toUpperCase();
  limparDestacados();

  var valido = true;
  for (var i = 0; i < palavra.length; i++) {
    var letraAtual = palavra[i];
    var coluna = document.getElementById(`coluna${letraAtual.charCodeAt(0)}linha${i}`);

    if (coluna && validaLetraPorPosicao(letraAtual, i) && valido) {
      coluna.classList.add("destacado");
    } else {
      if (coluna) {
        coluna.classList.add("invalido");
      }
      valido = false;
    }
  }

  if (campoInput.value.endsWith(" ")) {
    if (valido && palavra !== "") {
      if (!adicionarAoHistorico("aceitas", palavra.trim())) {
        exibirAviso("A palavra já foi validada anteriormente.", false);
      }
    } else {
      limparDestacados();
      adicionarAoHistorico("rejeitadas", palavra.trim());
    }
    campoInput.value = "";
  }
}

function adicionarAoHistorico(lista, palavra) {
  var listaElementos =
    lista === "aceitas"
      ? document.getElementById("lista-palavras-aceitas")
      : document.getElementById("lista-palavras-rejeitadas");

  var itensExistentes = Array.from(listaElementos.children).map((item) => item.textContent);
  if (itensExistentes.includes(palavra)) return false;

  var novoItem = document.createElement("li");
  novoItem.textContent = palavra;
  listaElementos.appendChild(novoItem);
  return true;
}

function validaLetraPorPosicao(letra, posicao) {
  return listaPalavras.some((palavra) => palavra[posicao] === letra);
}

function limparDestacados() {
  var colunasDestacadas = document.querySelectorAll(".destacado, .invalido");
  colunasDestacadas.forEach((coluna) => coluna.classList.remove("destacado", "invalido"));
}

function limpar() {
  console.log("Função de limpeza chamada");

  listaPalavras = [];

  document.getElementById("token").value = "";
  document.getElementById("validar-token").value = "";

  var divExibePalavras = document.querySelector(".palavras-adicionadas");
  divExibePalavras.innerHTML = "";

  var divValidaPalavraAceitas = document.querySelector(".lista-palavras");
  divValidaPalavraAceitas.innerHTML = "";

  var divValidaPalavraRejeitada = document.getElementById("lista-palavras-rejeitadas");
  divValidaPalavraRejeitada.innerHTML = "";
  
  const corpoTabela = document.getElementById("tbody");
  if (corpoTabela) {
    corpoTabela.innerHTML = "";
  } else {
    console.log("Elemento tbody não encontrado.");
  }

  limparDestacados();
}
