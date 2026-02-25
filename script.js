// CONFIGURAÇÕES
const WHATSAPP_NUMBER = '5511999999999'; // Substitua pelo número da pizzaria

// VARIÁVEIS GLOBAIS
let produtos = [];
let carrinho = [];

// MAPA DE DIAS DA SEMANA
const DIAS_SEMANA = {
    0: 'DOMINGO',
    1: 'SEGUNDA',
    2: 'TERÇA',
    3: 'QUARTA',
    4: 'QUINTA',
    5: 'SEXTA',
    6: 'SÁBADO'
};

// PROMOÇÕES DA SEMANA - COM IMAGENS LOCAIS
const PROMOCOES = [
    {
        id: 101,
        dia: 'SEGUNDA',
        diaNumero: 1,
        nome: 'Baratíssima Calabresa',
        descricao: 'A clássica calabresa com cebola e azeitonas',
        precoOriginal: 42.90,
        precoPromo: 23.99,
        categoria: 'salgadas',
        imagem: "imagens/pizza1.jpg"
    },
    {
        id: 102,
        dia: 'TERÇA',
        diaNumero: 2,
        nome: 'Baratíssima Bacon',
        descricao: '2 Pizzas de Bacon na mesma mesa',
        precoOriginal: 64.00,
        precoPromo: 54.00,
        categoria: 'salgadas',
        imagem: "imagens/pizza1.jpg"
    },
    {
        id: 103,
        dia: 'QUARTA',
        diaNumero: 3,
        nome: 'Baratíssima Napolitana',
        descricao: '2 Pizzas Napolitanas na mesma mesa',
        precoOriginal: 64.00,
        precoPromo: 54.00,
        categoria: 'salgadas',
        imagem: "imagens/pizza1.jpg"
    },
    {
        id: 104,
        dia: 'QUINTA',
        diaNumero: 4,
        nome: 'Baratíssima Carijo',
        descricao: 'A famosa pizza Carijo com catupiry',
        precoOriginal: 46.90,
        precoPromo: 23.99,
        categoria: 'salgadas',
        imagem: "imagens/pizza1.jpg"
    },
    {
        id: 105,
        dia: 'SEXTA',
        diaNumero: 5,
        nome: 'Baratíssima Baiana',
        descricao: 'Baiana especial com pimenta',
        precoOriginal: 43.90,
        precoPromo: 23.99,
        categoria: 'salgadas',
        imagem: "imagens/pizza1.jpg"
    },
    {
        id: 106,
        dia: 'SÁBADO',
        diaNumero: 6,
        nome: 'Baratíssima Mussarela',
        descricao: 'Mussarela tradicional',
        precoOriginal: 39.90,
        precoPromo: 23.99,
        categoria: 'salgadas',
        imagem: "imagens/pizza1.jpg"
    }
];

// ELEMENTOS DO DOM
const promoDiaContainer = document.getElementById('promoDiaContainer');
const promosGrid = document.getElementById('promosGrid');
const produtosGrid = document.getElementById('produtosGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const continueBtn = document.getElementById('continueBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const filterBtns = document.querySelectorAll('.filtro-btn');
const toast = document.getElementById('toast');
const cartFloating = document.getElementById('cartFloating');
const cartFloatingBtn = document.getElementById('cartFloatingBtn');
const cartFloatingCount = document.getElementById('cartFloatingCount');

// FUNÇÃO PARA OBTER DIA ATUAL
function getDiaAtual() {
    const hoje = new Date();
    return {
        numero: hoje.getDay(),
        nome: DIAS_SEMANA[hoje.getDay()]
    };
}

// FUNÇÃO PARA VERIFICAR SE PROMOÇÃO ESTÁ DISPONÍVEL HOJE
function isPromocaoHoje(promocao) {
    const diaAtual = getDiaAtual();
    return promocao.diaNumero === diaAtual.numero;
}

// MOSTRAR PROMOÇÃO DO DIA
function mostrarPromocaoDia() {
    const diaAtual = getDiaAtual();
    const promocaoHoje = PROMOCOES.find(p => p.diaNumero === diaAtual.numero);
    
    if (!promocaoHoje) {
        promoDiaContainer.innerHTML = `
            <div class="promo-dia-card" style="background: linear-gradient(135deg, #666, #444);">
                <div class="promo-dia-overlay"></div>
                <div class="promo-dia-content">
                    <span class="promo-dia-label">DOMINGO</span>
                    <h2 class="promo-dia-titulo">Hoje é Domingo</h2>
                    <p class="promo-dia-descricao">Aproveite nosso cardápio completo!</p>
                    <div class="promo-dia-preco">
                        <span class="promo-dia-preco-novo">Cardápio Especial</span>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    promoDiaContainer.innerHTML = `
        <div class="promo-dia-card" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${promocaoHoje.imagem}');">
            <div class="promo-dia-overlay"></div>
            <div class="promo-dia-content">
                <span class="promo-dia-badge"><i class="fas fa-star"></i> PROMOÇÃO DO DIA</span>
                <span class="promo-dia-label">${diaAtual.nome}-FEIRA</span>
                <h2 class="promo-dia-titulo">${promocaoHoje.nome}</h2>
                <p class="promo-dia-descricao">${promocaoHoje.descricao}</p>
                <div class="promo-dia-preco">
                    <span class="promo-dia-preco-antigo">R$ ${promocaoHoje.precoOriginal.toFixed(2)}</span>
                    <span class="promo-dia-preco-novo">R$ ${promocaoHoje.precoPromo.toFixed(2)}</span>
                </div>
                <button class="promo-dia-btn" onclick="adicionarPromocao(${promocaoHoje.id})">
                    <i class="fas fa-cart-plus"></i> Aproveitar Promoção
                </button>
            </div>
        </div>
    `;
}

// MOSTRAR PROMOÇÕES DA SEMANA
function mostrarPromocoesSemana() {
    const diaAtual = getDiaAtual();
    
    promosGrid.innerHTML = PROMOCOES.map(promo => {
        const disponivelHoje = isPromocaoHoje(promo);
        const diasRestantes = promo.diaNumero - diaAtual.numero;
        
        let disponibilidadeTexto = '';
        if (!disponivelHoje && diasRestantes > 0 && diasRestantes < 7) {
            if (diasRestantes === 1) disponibilidadeTexto = 'Amanhã!';
            else if (diasRestantes === 2) disponibilidadeTexto = 'Depois de amanhã';
            else disponibilidadeTexto = `${diasRestantes} dias`;
        }
        
        return `
            <div class="promo-card ${disponivelHoje ? 'disponivel-hoje' : ''}">
                <span class="promo-tag ${disponivelHoje ? 'promo-tag-hoje' : 'promo-tag-indisponivel'}">
                    <i class="fas fa-${disponivelHoje ? 'star' : 'clock'}"></i>
                    ${disponivelHoje ? 'DISPONÍVEL HOJE' : (disponibilidadeTexto || 'Indisponível')}
                </span>
                <div class="promo-image" style="background-image: url('${promo.imagem}');">
                    <div class="promo-image-overlay"></div>
                </div>
                <div class="promo-content">
                    <div class="promo-dia">
                        <i class="fas fa-calendar-day"></i> ${promo.dia}-FEIRA
                    </div>
                    <h3 class="promo-nome">${promo.nome}</h3>
                    <div class="promo-preco-box">
                        <span class="promo-preco-antigo">R$ ${promo.precoOriginal.toFixed(2)}</span>
                        <span class="promo-preco-novo">R$ ${promo.precoPromo.toFixed(2)}</span>
                    </div>
                    <button class="promo-btn" onclick="adicionarPromocao(${promo.id})" ${!disponivelHoje ? 'disabled' : ''}>
                        <i class="fas fa-${disponivelHoje ? 'cart-plus' : 'clock'}"></i>
                        ${disponivelHoje ? 'Adicionar' : (disponibilidadeTexto ? `Disponível ${disponibilidadeTexto}` : 'Indisponível')}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// CARREGAR PRODUTOS DO JSON
async function carregarProdutos() {
    try {
        const response = await fetch('produtos.json');
        produtos = await response.json();
        mostrarProdutos('all');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtosGrid.innerHTML = '<p style="text-align: center; padding: 20px;">Erro ao carregar produtos</p>';
    }
}

// MOSTRAR PRODUTOS (COM IMAGENS LOCAIS)
function mostrarProdutos(filtro) {
    const produtosFiltrados = filtro === 'all' 
        ? produtos 
        : produtos.filter(p => p.categoria === filtro);

    if (produtosFiltrados.length === 0) {
        produtosGrid.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum produto encontrado</p>';
        return;
    }

    produtosGrid.innerHTML = produtosFiltrados.map(produto => `
        <div class="produto-card">
            <div class="produto-image" style="background-image: url('${produto.imagem}');">
                <div class="produto-image-overlay"></div>
            </div>
            <div class="produto-content">
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-descricao">${produto.descricao}</p>
                <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
                <button class="produto-btn" onclick="adicionarAoCarrinho(${produto.id})">
                    <i class="fas fa-cart-plus"></i> Adicionar
                </button>
            </div>
        </div>
    `).join('');
}

// ADICIONAR PROMOÇÃO
function adicionarPromocao(promoId) {
    const promo = PROMOCOES.find(p => p.id === promoId);
    
    if (!isPromocaoHoje(promo)) {
        mostrarToast('❌ Esta promoção não está disponível hoje!');
        return;
    }
    
    const itemExistente = carrinho.find(item => item.id === promoId);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: promoId,
            nome: promo.nome,
            preco: promo.precoPromo,
            categoria: promo.categoria,
            quantidade: 1,
            isPromo: true,
            imagem: promo.imagem
        });
    }
    
    atualizarCarrinho();
    mostrarToast('🎉 Promoção adicionada!');
}

// ADICIONAR PRODUTO NORMAL
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    atualizarCarrinho();
    mostrarToast('🍕 Produto adicionado!');
}

// REMOVER DO CARRINHO
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarCarrinho();
    mostrarToast('🗑️ Item removido');
}

// ALTERAR QUANTIDADE
function alterarQuantidade(produtoId, delta) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        const novaQuantidade = item.quantidade + delta;
        if (novaQuantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            item.quantidade = novaQuantidade;
            atualizarCarrinho();
        }
    }
}

// ATUALIZAR CARRINHO
function atualizarCarrinho() {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    // Atualizar contadores
    cartCount.textContent = totalItens;
    if (cartFloatingCount) {
        cartFloatingCount.textContent = totalItens;
    }
    
    // Mostrar/esconder botão flutuante no mobile
    if (window.innerWidth < 768 && totalItens > 0) {
        cartFloating.style.display = 'flex';
    } else {
        cartFloating.style.display = 'none';
    }

    // Atualizar itens do carrinho
    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        cartTotal.textContent = 'R$ 0,00';
    } else {
        cartItems.innerHTML = carrinho.map(item => `
            <div class="cart-item">
                <div class="cart-item-image" style="background-image: url('${item.imagem}');"></div>
                <div class="cart-item-info">
                    <div class="cart-item-nome">${item.nome}</div>
                    <div class="cart-item-preco">R$ ${item.preco.toFixed(2)}</div>
                    <div class="cart-item-acoes">
                        <div class="cart-quantidade">
                            <button class="qtd-btn" onclick="alterarQuantidade(${item.id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="qtd-numero">${item.quantidade}</span>
                            <button class="qtd-btn" onclick="alterarQuantidade(${item.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-btn" onclick="removerDoCarrinho(${item.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = calcularTotal();
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
}

// CALCULAR TOTAL
function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// MOSTRAR TOAST
function mostrarToast(mensagem) {
    toast.style.display = 'flex';
    toast.innerHTML = mensagem;
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

// FINALIZAR PEDIDO
function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarToast('❌ Carrinho vazio!');
        return;
    }

    const total = calcularTotal();
    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');
    const diaAtual = getDiaAtual();

    let mensagem = '🍕 *UNIVERSIDADE DA PIZZA*\n';
    mensagem += '═══════════════════════\n\n';
    mensagem += `📅 *Data:* ${dataFormatada}\n`;
    mensagem += `⏰ *Hora:* ${horaFormatada}\n`;
    mensagem += `📆 *Dia:* ${diaAtual.nome}-FEIRA\n\n`;
    mensagem += '*📋 PEDIDO:*\n';
    
    carrinho.forEach(item => {
        mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    
    mensagem += `\n💰 *TOTAL: R$ ${total.toFixed(2)}*\n`;
    mensagem += '═══════════════════════\n\n';
    mensagem += '*📍 DADOS PARA ENTREGA:*\n';
    mensagem += '▸ Nome: \n';
    mensagem += '▸ Endereço: \n';
    mensagem += '▸ Número: \n';
    mensagem += '▸ Bairro: CDE\n';
    mensagem += '▸ Telefone: \n\n';
    mensagem += '*💳 FORMA DE PAGAMENTO:*\n';
    mensagem += '▸ ( ) Dinheiro\n';
    mensagem += '▸ ( ) Cartão\n';
    mensagem += '▸ ( ) Pix\n\n';
    mensagem += '*⏰ HORÁRIO:*\n';
    mensagem += 'Seg a Qui: 19h às 00h\n';
    mensagem += 'Sex a Dom: até 01h\n\n';
    mensagem += '✅ *Aguardando confirmação!*\n';
    mensagem += 'Obrigado pela preferência! 🍕';

    const mensagemCodificada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagemCodificada}`, '_blank');
    
    mostrarToast('✅ Pedido enviado!');
}

// EVENTOS
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

if (cartFloatingBtn) {
    cartFloatingBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
}

function closeCart() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

cartClose.addEventListener('click', closeCart);
continueBtn.addEventListener('click', closeCart);

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCart();
    }
});

checkoutBtn.addEventListener('click', finalizarPedido);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mostrarProdutos(btn.dataset.filter);
    });
});

// AJUSTAR LAYOUT AO REDIMENSIONAR
window.addEventListener('resize', () => {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    if (window.innerWidth >= 768) {
        cartFloating.style.display = 'none';
    } else if (totalItens > 0) {
        cartFloating.style.display = 'flex';
    }
});

// INICIAR
document.addEventListener('DOMContentLoaded', () => {
    mostrarPromocaoDia();
    mostrarPromocoesSemana();
    carregarProdutos();
});