document.addEventListener("DOMContentLoaded", () => {
    carregarConcluidos();
});

// carregar concluídos
function carregarConcluidos() {
    fetch("http://localhost:3000/habitos/concluidos")
        .then(res => res.json())
        .then(lista => renderConcluidos(lista))
        .catch(err => console.error("Erro ao carregar concluídos:", err));
}

function renderConcluidos(lista) {
    const container = document.getElementById("concluidosContainer");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhum hábito concluído hoje.</p>";
        return;
    }

    lista.forEach(habito => {
        const card = document.createElement("div");
        card.className = "card-habito";

        card.innerHTML = `
            <h2>${habito.nome}</h2>
            <p>${habito.categoria ?? ""}</p>
        `;

        container.appendChild(card);
    });
}

// 🔹 BOTÕES DE NAVEGAÇÃO
document.getElementById("btnHome").onclick = () => {
    window.location.href = "index.html";
};

document.getElementById("btnConcluidos").onclick = () => {
    window.location.href = "concluidos.html";
};
