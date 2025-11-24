// ===== Sistema de XP =====
class GerenciadorXP {
    constructor() {
        this.xp = this.carregarXP();
        this.nivel = this.calcularNivel();
    }

    carregarXP() {
        const xpSalvo = localStorage.getItem('xp');
        return xpSalvo ? parseInt(xpSalvo) : 0;
    }

    salvarXP() {
        localStorage.setItem('xp', this.xp.toString());
    }

    calcularNivel() {
        // Fórmula: nível = floor(√(xp / 100)) + 1
        return Math.floor(Math.sqrt(this.xp / 100)) + 1;
    }

    calcularXPProximoNivel() {
        const nivelAtual = this.nivel;
        const xpParaProximoNivel = Math.pow(nivelAtual, 2) * 100;
        const xpNivelAtual = Math.pow(nivelAtual - 1, 2) * 100;
        return {
            atual: this.xp - xpNivelAtual,
            necessario: xpParaProximoNivel - xpNivelAtual
        };
    }

    adicionarXP(quantidade) {
        const nivelAntes = this.nivel;
        this.xp += quantidade;
        this.nivel = this.calcularNivel();
        this.salvarXP();
    
        // Verificar se subiu de nível
        const subiuNivel = this.nivel > nivelAntes;
        if (subiuNivel) {
            this.mostrarLevelUp();
        }
    
        return subiuNivel; // Retorna true se subiu de nível, false caso contrário
    }
    mostrarLevelUp() {
        setTimeout(() => {
            mostrarMensagem(`🎉 Parabéns! Você subiu para o nível ${this.nivel}!`, "sucesso");
        }, 500);
    }
}
// ===== Gerenciamento de Dados =====
class GerenciadorHabitos {
    constructor() {
        this.habitos = this.carregarHabitos();
        this.habitosConcluidos = this.carregarHabitosConcluidos();
        this.idParaExcluir = null;
    }

    // Carregar hábitos do localStorage
    carregarHabitos() {
        const habitosSalvos = localStorage.getItem('habitos');
        return habitosSalvos ? JSON.parse(habitosSalvos) : [];
    }

    // Carregar hábitos concluídos do localStorage
    carregarHabitosConcluidos() {
        const concluidosSalvos = localStorage.getItem('habitosConcluidos');
        return concluidosSalvos ? JSON.parse(concluidosSalvos) : [];
    }

    // Salvar hábitos no localStorage
    salvarHabitos() {
        localStorage.setItem('habitos', JSON.stringify(this.habitos));
    }

    // Salvar hábitos concluídos no localStorage
    salvarHabitosConcluidos() {
        localStorage.setItem('habitosConcluidos', JSON.stringify(this.habitosConcluidos));
    }

    // Adicionar novo hábito
    adicionarHabito(nome, categoria) {
        const novoHabito = {
            id: Date.now(),
            nome: nome.trim(),
            categoria: categoria.trim(),
            dataCriacao: new Date().toISOString()
        };
        this.habitos.push(novoHabito);
        this.salvarHabitos();
        return novoHabito;
    }

    // Concluir hábito
// Concluir hábito
concluirHabito(id) {
    const habitoIndex = this.habitos.findIndex(h => h.id === id);
    if (habitoIndex !== -1) {
        const habitoConcluido = this.habitos[habitoIndex];
        habitoConcluido.dataConclusao = new Date().toISOString();
        
        // Adicionar XP
        const subiuNivel = gerenciadorXP.adicionarXP(10);
        
        // Adicionar aos concluídos
        this.habitosConcluidos.push(habitoConcluido);
        
        // Remover dos ativos
        this.habitos.splice(habitoIndex, 1);
        
        this.salvarHabitos();
        this.salvarHabitosConcluidos();
        
        // Atualizar barra de XP
        renderSistemaXP();
        
        // Mostrar mensagem personalizada (apenas se não subiu de nível)
        if (!subiuNivel) {
            setTimeout(() => {
                mostrarMensagem("Você concluiu um hábito! Parabéns! 🎉<br>Seu XP aumentou! Continue assim e mantenha o progresso!", "sucesso");
            }, 300);
        }
        
        return habitoConcluido;
    }
    return null;
}

    // Excluir hábito
    excluirHabito(id) {
        this.habitos = this.habitos.filter(h => h.id !== id);
        this.salvarHabitos();
    }

    // Obter hábitos ativos
    getHabitosAtivos() {
        return this.habitos;
    }

    // Obter hábitos concluídos
    getHabitosConcluidos() {
        return this.habitosConcluidos;
    }
}

// ===== Inicialização =====
const gerenciador = new GerenciadorHabitos();
const gerenciadorXP = new GerenciadorXP(); // Adicione esta linha

document.addEventListener("DOMContentLoaded", () => {
    renderHabitos();
    setupModalAdicionar();
    setupModalExcluir();
    renderSistemaXP(); // Adicione esta linha
});

// ===== Renderizar hábitos =====
function renderHabitos() {
    const container = document.getElementById("habitosContainer");
    container.innerHTML = "";
    
    const habitos = gerenciador.getHabitosAtivos();
    
    if (habitos.length === 0) {
        container.innerHTML = '<p class="sem-habitos">Nenhum hábito cadastrado ainda.</p>';
        return;
    }

    habitos.forEach(habito => {
        const card = document.createElement("div");
        card.className = "card-habito";
        card.innerHTML = `
            <div class="info-habito">
                <span class="nome-habito">${habito.nome}</span>
                ${habito.categoria ? `<span class="categoria-habito">${habito.categoria}</span>` : ''}
            </div>
            <div class="acoes">
                <button class="btn-concluir" type="button" title="Concluir hábito">✔</button>
                <button class="btn-excluir" type="button" title="Excluir hábito">🗑</button>
            </div>
        `;
        
        // Concluir hábito
        card.querySelector(".btn-concluir").addEventListener("click", (e) => {
            e.preventDefault();
            const habitoConcluido = gerenciador.concluirHabito(habito.id);
            if (habitoConcluido) {
                renderHabitos();
            }
        });
        
        // Excluir hábito
        card.querySelector(".btn-excluir").addEventListener("click", (e) => {
            e.preventDefault();
            gerenciador.idParaExcluir = habito.id;
            document.getElementById("modalConfirmar").classList.add("ativo");
        });
        
        container.appendChild(card);
    });
}

// ===== Modal Adicionar =====
function setupModalAdicionar() {
    const modal = document.getElementById("modalAdicionar");
    const btnAdd = document.getElementById("btnAdd");
    const btnFechar = document.getElementById("btnFecharModal");
    const btnSalvar = document.getElementById("btnSalvar");
    const inputNome = document.getElementById("inputNomeHabito");
    const inputCategoria = document.getElementById("inputCategoriaHabito");

    btnAdd.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("ativo");
        inputNome.focus();
    });
    
    btnFechar.addEventListener("click", (e) => {
        e.preventDefault();
        fecharModalAdicionar();
    });
    
    modal.addEventListener("click", e => { 
        if(e.target === modal) {
            fecharModalAdicionar();
        }
    });

    btnSalvar.addEventListener("click", (e) => {
        e.preventDefault();
        const nome = inputNome.value.trim();
        const categoria = inputCategoria.value.trim();
        
        if (!nome) {
            mostrarMensagem("Digite o nome do hábito!", "erro");
            inputNome.focus();
            return;
        }

        gerenciador.adicionarHabito(nome, categoria);
        fecharModalAdicionar();
        renderHabitos();
        mostrarMensagem("Hábito adicionado com sucesso!");
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('ativo')) {
            fecharModalAdicionar();
        }
    });

    function fecharModalAdicionar() {
        modal.classList.remove("ativo");
        inputNome.value = "";
        inputCategoria.value = "";
    }
}

// ===== Modal Excluir =====
function setupModalExcluir() {
    const modal = document.getElementById("modalConfirmar");
    const btnCancelar = document.getElementById("btnCancelarExcluir");
    const btnConfirmar = document.getElementById("btnConfirmarExcluir");

    btnCancelar.addEventListener("click", (e) => {
        e.preventDefault();
        fecharModalExcluir();
    });
    
    modal.addEventListener("click", e => { 
        if(e.target === modal) {
            fecharModalExcluir();
        }
    });

    btnConfirmar.addEventListener("click", (e) => {
        e.preventDefault();
        if (gerenciador.idParaExcluir) {
            gerenciador.excluirHabito(gerenciador.idParaExcluir);
            fecharModalExcluir();
            renderHabitos();
            mostrarMensagem("Hábito excluído com sucesso!");
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('ativo')) {
            fecharModalExcluir();
        }
    });

    function fecharModalExcluir() {
        modal.classList.remove("ativo");
        gerenciador.idParaExcluir = null;
    }
}

// ===== Função para mostrar mensagens =====
// ===== Função para mostrar mensagens =====
function mostrarMensagem(mensagem, tipo = "sucesso") {
    // Remove mensagem anterior se existir
    const mensagemAnterior = document.querySelector('.mensagem-flutuante');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }

    const divMensagem = document.createElement('div');
    divMensagem.className = `mensagem-flutuante ${tipo}`;
    divMensagem.innerHTML = mensagem; // Mude de textContent para innerHTML
    
    document.body.appendChild(divMensagem);
    
    // Mostrar mensagem
    setTimeout(() => {
        divMensagem.classList.add('mostrar');
    }, 10);
    
    // Remover após 4 segundos (aumentei para dar tempo de ler)
    setTimeout(() => {
        divMensagem.classList.remove('mostrar');
        setTimeout(() => {
            if (divMensagem.parentNode) {
                divMensagem.remove();
            }
        }, 300);
    }, 4000);
}
// ===== Renderizar Sistema de XP =====
function renderSistemaXP() {
    // Remove o sistema XP anterior se existir
    const sistemaXPAnterior = document.querySelector('.sistema-xp');
    if (sistemaXPAnterior) {
        sistemaXPAnterior.remove();
    }

    const xpInfo = gerenciadorXP.calcularXPProximoNivel();
    const porcentagem = (xpInfo.atual / xpInfo.necessario) * 100;

    const sistemaXP = document.createElement('div');
    sistemaXP.className = 'sistema-xp';
    sistemaXP.innerHTML = `
        <div class="xp-info">
            <span class="nivel">Nível ${gerenciadorXP.nivel}</span>
            <span class="xp-texto">${xpInfo.atual}/${xpInfo.necessario} XP</span>
        </div>
        <div class="barra-xp">
            <div class="progresso-xp" style="width: ${porcentagem}%"></div>
        </div>
    `;

    document.body.appendChild(sistemaXP);
}