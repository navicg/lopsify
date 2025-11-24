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

    calcularNivel() {
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
}
// ===== Gerenciamento de Dados =====
class GerenciadorHabitosConcluidos {
    constructor() {
        this.habitosConcluidos = this.carregarHabitosConcluidos();
    }

    // Carregar hábitos concluídos do localStorage
    carregarHabitosConcluidos() {
        const concluidosSalvos = localStorage.getItem('habitosConcluidos');
        return concluidosSalvos ? JSON.parse(concluidosSalvos) : [];
    }

    // Obter hábitos concluídos
    getHabitosConcluidos() {
        return this.habitosConcluidos;
    }

    // Formatar data
    formatarData(dataISO) {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// ===== Inicialização =====
const gerenciadorConcluidos = new GerenciadorHabitosConcluidos();
const gerenciadorXP = new GerenciadorXP(); // Adicione esta linha

document.addEventListener("DOMContentLoaded", () => {
    renderHabitosConcluidos();
    renderSistemaXP(); // Adicione esta linha
});

// ===== Renderizar hábitos concluídos =====
function renderHabitosConcluidos() {
    const container = document.getElementById("concluidosContainer");
    container.innerHTML = "";
    
    const habitosConcluidos = gerenciadorConcluidos.getHabitosConcluidos();
    
    if (habitosConcluidos.length === 0) {
        container.innerHTML = '<p class="sem-habitos">Nenhum hábito concluído ainda.</p>';
        return;
    }

    // Ordenar por data de conclusão (mais recente primeiro)
    habitosConcluidos.sort((a, b) => new Date(b.dataConclusao) - new Date(a.dataConclusao));

    habitosConcluidos.forEach(habito => {
        const card = document.createElement("div");
        card.className = "card-habito-concluido";
        card.innerHTML = `
            <div class="info-habito">
                <span class="nome-habito">${habito.nome}</span>
                ${habito.categoria ? `<span class="categoria-habito">${habito.categoria}</span>` : ''}
                <span class="data-conclusao">Concluído em: ${gerenciadorConcluidos.formatarData(habito.dataConclusao)}</span>
            </div>
            <div class="status-concluido">
                ✔
            </div>
        `;
        container.appendChild(card);
    });
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