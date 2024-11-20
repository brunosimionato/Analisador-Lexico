var listaPalavras = [];
var listaPalavrasValidadas = [];

document.addEventListener("DOMContentLoaded", function() {
  // BOTÃO ADICIONAR
  var botaoAdicionar = document.getElementById("adicionar");
  botaoAdicionar.addEventListener("click", adicionarPalavra);

  // BOTÃO LIMPAR
  var botaoLimpar = document.getElementById("limpar");
  botaoLimpar.addEventListener("click", limpar);

  var validaPalavrainput = document.getElementById("validar-token");
  validaPalavrainput.addEventListener("input", function() {
    validaPalavra();
  });

  // VALIDA OU NÃO A PALAVRA APÓS SPACE
  validaPalavrainput.addEventListener("keyup", function(event) {
    if (event.key === "Enter" || event.key === " ") {
      validaPalavra();
    }
  });
});



// COLOCA AS PALAVRAS NA LISTA E NA TABELA
function exibePalavraNaTela(palavra) {
  listaPalavras.push(palavra);
  var divExibePalavras = document.querySelector(".palavras-adicionadas");
  var novoElemento = document.createElement("p");
  novoElemento.className = "palavra";
  novoElemento.innerText = palavra;
    
  divExibePalavras.appendChild(novoElemento);

  preencheTabela(palavra);
}



// PEGA AS PALAVRAS DO INPUT E COLOCA NA DIV DE PALAVRAS ADICIONADAS
function adicionarPalavra() {
  var palavra = document.getElementById("token").value.trim().toUpperCase();
  
  if (palavra === "") {
    alert("Por favor, insira uma palavra.");
    return false;
  }

  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(palavra)) {
    alert("Por favor, insira apenas letras.", false);
    return;
  }

  if (listaPalavras.includes(palavra)) {
    alert("Esta palavra já foi informada.", false);
    return;
  }
  
  exibePalavraNaTela(palavra);
  document.getElementById("token").value = "";
}



// COM BASE NA LISTA DE PALAVRAS, PREENCHE A TABELA COM OS ESTADOS
function preencheTabela(palavra) {
  var corpoTabela = document.getElementById("tbody");

  var letras = palavra.split("");
  
  for (var j = 0; j < letras.length; j++) {
    var ultimaLetra = letras.length - 1 === j;
    var linhaJaExistente = document.getElementById("linha" + j);
    var novaLinha = criaNovaLinhaOuAtualiza(j, false, letras);

    if (!linhaJaExistente) {
      corpoTabela.appendChild(novaLinha);
    }

    if (ultimaLetra) {
      var posicaoFinal = j + 1;
      var linhaFinalJaExistente = document.getElementById("linha" + posicaoFinal);
      var linhaFinal = criaNovaLinhaOuAtualiza(posicaoFinal, true, letras);

      if (!linhaFinalJaExistente) {
        corpoTabela.appendChild(linhaFinal);
      }
    }
  }
}

function criaNovaLinhaOuAtualiza(j, ultimaLetra, letras) {
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
    var posicaoLetra = letras[j] === letra;
    var proximaSentenca = j + 1;
    var colunaId = 'coluna' + i + 'linha' + j;
    var coluna = document.getElementById(colunaId);

    if (!coluna) {
      coluna = document.createElement('td');
      coluna.id = colunaId;
      coluna.className = 'coluna';
      linha.appendChild(coluna);
    }

    if (posicaoLetra && !ultimaLetra && coluna.innerHTML === '') {
      coluna.textContent = 'q' + proximaSentenca;
    } else if (coluna.innerHTML === '') {
      coluna.innerHTML = '';
    }
  }

  return linha;
}



// VALIDA PALAVRA
function validaPalavra() {
  var campoInput = document.getElementById("validar-token");
  var palavra = campoInput.value.trim().toUpperCase();
  limparDestacados();

  var valido = true; // Indica se todo o caminho até agora é válido

  for (var i = 0; i < palavra.length; i++) {
    var letraAtual = palavra[i];
    var coluna = document.getElementById("coluna" + letraAtual.charCodeAt(0) + "linha" + i);

    if (coluna && validaLetraPorPosicao(letraAtual, i) && valido) {
      coluna.classList.add("destacado"); // (VERDE)
    } else {
      if (coluna) {
        coluna.classList.add("invalido"); // (VERMELHO)
      }
      valido = false;
    }
  }

  // Verificar se a palavra foi completamente validada e finalizada com um espaço
  if (campoInput.value.endsWith(" ")) {
    if (valido && palavra !== "") {
      if (!alterarCorPalavra(palavra.trim())) {
        alert("A palavra já foi validada anteriormente.");
      }
    } else {
      limparDestacados();
      alert("Palavra não é válida.");
    }
    campoInput.value = "";
  }
}

function validaLetraPorPosicao(letra, posicao) {
  for (var i = 0; i < listaPalavras.length; i++) {
    if (listaPalavras[i][posicao] === letra) {
      return true;
    }
  }
  return false;
}

function limparDestacados() {
  var colunasDestacadas = document.querySelectorAll(".destacado, .invalido");
  colunasDestacadas.forEach(function(coluna) {
    coluna.classList.remove("destacado", "invalido");
  });
}

// PALAVRA VALIDADA APÓS SPACE
function alterarCorPalavra(palavra) {
  var palavrasExistentes = document.querySelectorAll(".palavra");
  var jaValidada = false;

  palavrasExistentes.forEach(function(palavraElemento) {
    if (palavraElemento.textContent.trim().toUpperCase() === palavra) {
      if (palavraElemento.style.backgroundColor === "rgb(82, 158, 67)") {
        jaValidada = true; // Já está validada
      } else {
        palavraElemento.style.backgroundColor = "#529e43"; // TOM VERDE
        palavraElemento.classList.add("palavra-validada"); // ANIMAÇÃO
      }
    }
  });
  

  return !jaValidada; // RETORNA FALSA SE JÁ FOI VALIDADA E EXIBE AVISO
}



// LIMPA INPUTS E TABELA
function limpar() {
  console.log("Função de limpeza chamada");

  // Limpa palavras
  listaPalavras = [];
  listaPalavrasValidadas = [];

  // Limpa os inputs
  document.getElementById("token").value = "";
  document.getElementById("validar-token").value = "";
  var divExibePalavras = document.querySelector(".palavras-adicionadas");
  divExibePalavras.innerHTML = "";
  
  // Limpa tabela
  const corpoTabela = document.getElementById("tbody");
  if (corpoTabela) {
    corpoTabela.innerHTML = "";
  } else {
    console.log("Elemento tbody não encontrado.");
  }

  // Limpa destaques da tabela
  limparDestacados();
}
