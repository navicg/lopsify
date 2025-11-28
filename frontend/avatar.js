// ===== Gerenciador de Avatar =====
class GerenciadorAvatar {
    constructor() {
        this.avatarSelecionado = this.carregarAvatar();
        this.avatarTemporario = this.avatarSelecionado;
    }

    carregarAvatar() {
        const avatarSalvo = localStorage.getItem('avatarUsuario');
        return avatarSalvo || 'https://cdn-icons-png.flaticon.com/128/9187/9187604.png';
    }

    salvarAvatar(avatarUrl) {
        localStorage.setItem('avatarUsuario', avatarUrl);
        this.avatarSelecionado = avatarUrl;
    }

    getAvatar() {
        return this.avatarSelecionado;
    }
}

// ===== Inicialização =====
const gerenciadorAvatar = new GerenciadorAvatar();

document.addEventListener("DOMContentLoaded", () => {
    inicializarPaginaAvatar();
    setupEventListeners();
});

function inicializarPaginaAvatar() {
    // Atualizar avatar atual
    const avatarAtual = document.getElementById('avatarAtual');
    if (avatarAtual) {
        avatarAtual.src = gerenciadorAvatar.getAvatar();
    }

    // Marcar o avatar atual como selecionado
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        const avatarUrl = option.getAttribute('data-avatar');
        if (avatarUrl === gerenciadorAvatar.avatarSelecionado) {
            option.classList.add('selecionado');
        }

        option.addEventListener('click', () => {
            // Remover seleção anterior
            avatarOptions.forEach(opt => opt.classList.remove('selecionado'));
            
            // Selecionar novo avatar
            option.classList.add('selecionado');
            gerenciadorAvatar.avatarTemporario = avatarUrl;
            
            // Atualizar preview
            if (avatarAtual) {
                avatarAtual.src = avatarUrl;
            }
        });
    });
}

function setupEventListeners() {
    // Botão Salvar
    const btnSalvar = document.getElementById('btnSalvarAvatar');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', () => {
            gerenciadorAvatar.salvarAvatar(gerenciadorAvatar.avatarTemporario);
            mostrarMensagem('Avatar salvo com sucesso!', 'sucesso');
            
            // Redirecionar de volta após um breve delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Botão Voltar
    const btnVoltar = document.getElementById('btnVoltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// ===== Função para mostrar mensagens =====
function mostrarMensagem(mensagem, tipo = "sucesso") {
    const mensagemAnterior = document.querySelector('.mensagem-flutuante');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }

    const divMensagem = document.createElement('div');
    divMensagem.className = `mensagem-flutuante ${tipo}`;
    divMensagem.textContent = mensagem;
    
    document.body.appendChild(divMensagem);
    
    setTimeout(() => {
        divMensagem.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        divMensagem.classList.remove('mostrar');
        setTimeout(() => {
            if (divMensagem.parentNode) {
                divMensagem.remove();
            }
        }, 300);
    }, 3000);
}