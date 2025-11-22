async function carregarItens() {
    try {
        const resposta = await fetch("http://localhost:3000/habitos");
        const itens = await resposta.json();

        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        itens.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.nome;
            lista.appendChild(li);
        });
    } catch (erro) {
        console.error("Erro ao carregar itens:", erro);
    }
}

document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;

    try {
        await fetch("http://localhost:3000/habitos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome })
        });

        document.getElementById("nome").value = "";
        carregarItens();
    } catch (erro) {
        console.error("Erro ao enviar item:", erro);
    }
});

carregarItens();
