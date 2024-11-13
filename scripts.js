document.addEventListener("DOMContentLoaded", () => {
  const adicionarBtn = document.querySelector("button[name='btAdicionar']");
  const limparBtn = document.querySelector("button[name='btLimpar']");
  const tokenInput = document.getElementById("token");
  const palavrasAdicionadas = document.querySelector(".palavras-adicionadas");

  console.log(adicionarBtn, limparBtn, tokenInput, palavrasAdicionadas); // Verifica se os elementos estão sendo encontrados corretamente

  // Adiciona a palavra ao clicar em "ADICIONAR"
  adicionarBtn.addEventListener("click", () => {
    const palavra = tokenInput.value.trim(); // Obtém o valor do input e remove espaços extras
    console.log('Palavra digitada:', palavra); // Verifica o valor digitado
    if (palavra) { // Verifica se o input não está vazio
      const span = document.createElement("span");
      span.classList.add("palavra"); // Adiciona a classe "palavra" ao elemento
      span.textContent = palavra; // Define o texto do span como a palavra adicionada
      palavrasAdicionadas.appendChild(span); // Adiciona o span à div de palavras adicionadas
      tokenInput.value = ""; // Limpa o campo de entrada
    }
  });

  // Limpa todas as palavras ao clicar em "LIMPAR"
  limparBtn.addEventListener("click", () => {
    palavrasAdicionadas.innerHTML = ""; // Remove todo o conteúdo da div de palavras adicionadas
  });
});
