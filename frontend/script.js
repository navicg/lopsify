document.addEventListener("DOMContentLoaded", () => {
    carregarHabitos();
});

/* ===============================
   CARREGAR HÁBITOS
================================*/
function carregarHabitos() {
    fetch("http://localhost:3000/habitos")
        .then(res => res.json())
        .then(habitos => {
            renderHabitos(habitos);
        })
        .catch(err => console.error("Erro ao carregar hábitos:", err));
}

/* ===============================
   RENDERIZAR CARDS
================================*/
function renderHabitos(habitos) {
    const container = document.getElementById("habitosContainer");
    container.innerHTML = "";

    habitos.forEach(habito => {
        const card = document.createElement("div");
        card.className = "card-habito";

        card.innerHTML = `
            <h2>${habito.nome}</h2>
            <p>${habito.categoria ?? ""}</p>

            <div class="acoes">
                <button class="btn-concluir" data-id="${habito.id}">
                    ✔ Concluir
                </button>

                <button class="btn-excluir" data-id="${habito.id}">
                    🗑 Excluir
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    // botão concluir
    document.querySelectorAll(".btn-concluir").forEach(btn => {
        btn.addEventListener("click", () => concluirHabito(btn.dataset.id));
    });

    // botão excluir → agora abre modal bonito
    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", () => abrirModalExcluir(btn.dataset.id));
    });
}

/* ===============================
   CONCLUIR HÁBITO
================================*/
function concluirHabito(id) {
    fetch(`http://localhost:3000/habitos/${id}/concluir`, {
        method: "POST"
    })
        .then(res => res.json())
        .then(() => carregarHabitos())
        .catch(err => console.error("Erro ao concluir hábito:", err));
}

/* ===============================
   MODAL BONITO DE EXCLUSÃO
================================*/
const modalConfirmar = document.getElementById("modalConfirmar");
const btnCancelarExcluir = document.getElementById("btnCancelarExcluir");
const btnConfirmarExcluir = document.getElementById("btnConfirmarExcluir");

let idParaExcluir = null;

// abrir modal
function abrirModalExcluir(id) {
    idParaExcluir = id;
    modalConfirmar.classList.add("ativo");
}

// cancelar
btnCancelarExcluir.addEventListener("click", () => {
    modalConfirmar.classList.remove("ativo");
});

// clicar fora fecha
modalConfirmar.addEventListener("click", (e) => {
    if (e.target === modalConfirmar) {
        modalConfirmar.classList.remove("ativo");
    }
});

// confirmar EXCLUIR
btnConfirmarExcluir.addEventListener("click", () => {
    fetch(`http://localhost:3000/habitos/${idParaExcluir}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
        modalConfirmar.classList.remove("ativo");
        carregarHabitos();
    })
    .catch(err => console.error("Erro ao excluir hábito:", err));
});

/* ===============================
   NAVEGAÇÃO MENU INFERIOR
================================*/
document.getElementById("btnHome").onclick = () => {
    window.location.href = "index.html";
};

document.getElementById("btnConcluidos").onclick = () => {
    window.location.href = "concluidos.html";
};

/* ===============================
   MODAL DE ADICIONAR HÁBITO
================================*/
const modal = document.getElementById("modalAdicionar");
const btnAdd = document.getElementById("btnAdd");
const btnFechar = document.getElementById("btnFecharModal");
const btnSalvar = document.getElementById("btnSalvar");
const inputNome = document.getElementById("inputNomeHabito");
const inputCategoria = document.getElementById("inputCategoriaHabito");

// abrir modal
btnAdd.addEventListener("click", () => {
    modal.classList.add("ativo");
    inputNome.focus();
});

// fechar modal
btnFechar.addEventListener("click", () => {
    modal.classList.remove("ativo");
});

// clicar fora fecha
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("ativo");
    }
});

// salvar novo hábito
btnSalvar.addEventListener("click", async () => {
    const nome = inputNome.value.trim();
    const categoria = inputCategoria.value.trim();

    if (nome === "") {
        alert("Dê um nome ao hábito!");
        return;
    }

    await fetch("http://localhost:3000/habitos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, categoria })
    });
    
    inputNome.value = "";
    inputCategoria.value = "";
    modal.classList.remove("ativo");
    carregarHabitos();
});