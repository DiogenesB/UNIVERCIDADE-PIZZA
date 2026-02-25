// CONFIGURAÇÕES
const WHATSAPP_NUMBER = '5555991871850';
const STORAGE_KEY = '@universidad-pizza-carrinho';

// VARIÁVEIS GLOBAIS
let produtos = [];
let carrinho = [];
let ultimoItemAdicionado = null;

// DIAS DA SEMANA
const DIAS_SEMANA = {
    0: 'DOMINGO',
    1: 'SEGUNDA',
    2: 'TERÇA',
    3: 'QUARTA',
    4: 'QUINTA',
    5: 'SEXTA',
    6: 'SÁBADO'
};

// PROMOÇÕES - CORRIGIDO COM PLACEHOLDERS
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
        imagem: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format'
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
        imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format'
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
        imagem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format'
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
        imagem: 'https://images.unsplash.com/photo-1513104890138-7c749660a47f?w=400&auto=format'
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
        imagem: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&auto=format'
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
        imagem: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&auto=format'
    }
];

// ELEMENTOS DOM
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

// FUNÇÕES AUXILIARES
function getDiaAtual() {
    const hoje = new Date();
    return {
        numero: hoje.getDay(),
        nome: DIAS_SEMANA[hoje.getDay()]
    };
}

function isPromocaoHoje(promocao) {
    const diaAtual = getDiaAtual();
    return promocao.diaNumero === diaAtual.numero;
}

function salvarCarrinho() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
}

function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem(STORAGE_KEY);
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarCarrinho();
    }
}

// FUNÇÕES DE UI/UX
function mostrarToast(mensagem, tipo = 'sucesso') {
    toast.style.display = 'flex';
    toast.innerHTML = mensagem;
    toast.style.background = tipo === 'sucesso' ? '#2E7D32' : '#D32F2F';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2500);
}

function animarBotaoCarrinho() {
    cartBtn.classList.add('bump');
    setTimeout(() => cartBtn.classList.remove('bump'), 300);
    
    if (cartFloatingBtn) {
        cartFloatingBtn.classList.add('bump');
        setTimeout(() => cartFloatingBtn.classList.remove('bump'), 300);
    }
}

// RENDERIZAÇÃO
function mostrarPromocaoDia() {
    const diaAtual = getDiaAtual();
    const promocaoHoje = PROMOCOES.find(p => p.diaNumero === diaAtual.numero);
    
    if (!promocaoHoje) {
        promoDiaContainer.innerHTML = `
            <div class="promo-dia-card" style="background: linear-gradient(135deg, #666, #444);">
                <div class="promo-dia-overlay"></div>
                <div class="promo-dia-content">
                    <span class="promo-dia-badge"><i class="fas fa-star"></i> DOMINGO ESPECIAL</span>
                    <span class="promo-dia-label">${diaAtual.nome}</span>
                    <h2 class="promo-dia-titulo">Cardápio Completo</h2>
                    <p class="promo-dia-descricao">Aproveite todas as nossas opções especiais!</p>
                    <div class="promo-dia-preco">
                        <span class="promo-dia-preco-novo">Frete Grátis</span>
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
                    <i class="fas fa-cart-plus"></i> APROVEITAR OFERTA
                </button>
            </div>
        </div>
    `;
}

function mostrarPromocoesSemana() {
    const diaAtual = getDiaAtual();
    
    promosGrid.innerHTML = PROMOCOES.map(promo => {
        const disponivelHoje = isPromocaoHoje(promo);
        const diasRestantes = promo.diaNumero - diaAtual.numero;
        
        let disponibilidadeTexto = '';
        if (!disponivelHoje && diasRestantes > 0 && diasRestantes < 7) {
            if (diasRestantes === 1) disponibilidadeTexto = 'Amanhã!';
            else if (diasRestantes === 2) disponibilidadeTexto = 'Depois de amanhã';
            else disponibilidadeTexto = `Em ${diasRestantes} dias`;
        }
        
        return `
            <div class="promo-card ${disponivelHoje ? 'disponivel-hoje' : ''}">
                <span class="promo-tag ${disponivelHoje ? 'promo-tag-hoje' : 'promo-tag-indisponivel'}">
                    <i class="fas fa-${disponivelHoje ? 'star' : 'clock'}"></i>
                    ${disponivelHoje ? 'DISPONÍVEL HOJE' : (disponibilidadeTexto || 'INDISPONÍVEL')}
                </span>
                <div class="promo-image">
                    <img src="${promo.imagem}" alt="${promo.nome}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513104890138-7c749660a47f?w=400&auto=format';">
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
                        ${disponivelHoje ? 'ADICIONAR' : (disponibilidadeTexto || 'INDISPONÍVEL')}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function carregarProdutos() {
    try {
        const response = await fetch('produtos.json');
        produtos = await response.json();
        
        // Adiciona imagens do Unsplash para demonstração
        const imagensUnsplash = {
            salgadas: [
                'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format',
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format',
                'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format',
                'https://images.unsplash.com/photo-1513104890138-7c749660a47f?w=400&auto=format'
            ],
            doces: [
                'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format',
                'https://images.unsplash.com/photo-1613809755783-7a2d9b6f5d5b?w=400&auto=format'
            ],
            bebidas: [
                'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format',
                'https://images.unsplash.com/photo-1543253687-c931c150caec?w=400&auto=format'
            ]
        };
        
        produtos = produtos.map((produto, index) => {
            const imagensCategoria = imagensUnsplash[produto.categoria] || imagensUnsplash.salgadas;
            const imagemIndex = index % imagensCategoria.length;
            return {
                ...produto,
                imagem: imagensCategoria[imagemIndex]
            };
        });
        
        mostrarProdutos('all');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtosGrid.innerHTML = '<p style="text-align: center; padding: 40px;">Erro ao carregar produtos. Tente novamente.</p>';
    }
}

function mostrarProdutos(filtro) {
    const produtosFiltrados = filtro === 'all' 
        ? produtos 
        : produtos.filter(p => p.categoria === filtro);

    if (produtosFiltrados.length === 0) {
        produtosGrid.innerHTML = '<p style="text-align: center; padding: 40px;">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    produtosGrid.innerHTML = produtosFiltrados.map(produto => `
        <div class="produto-card">
            <div class="produto-image">
                <img src="${produto.imagem}" 
                     alt="${produto.nome}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513104890138-7c749660a47f?w=400&auto=format';">
                <div class="produto-tag-categoria">
                    ${produto.categoria === 'salgadas' ? '🍕 TRADICIONAL' : produto.categoria === 'doces' ? '🍰 DOCE' : '🥤 BEBIDA'}
                </div>
            </div>
            <div class="produto-content">
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-descricao">${produto.descricao}</p>
                <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
                <button class="produto-btn" onclick="adicionarAoCarrinho(${produto.id})">
                    <i class="fas fa-cart-plus"></i> ADICIONAR
                </button>
            </div>
        </div>
    `).join('');
}

// FUNÇÕES DO CARRINHO
function adicionarPromocao(promoId) {
    const promo = PROMOCOES.find(p => p.id === promoId);
    
    if (!isPromocaoHoje(promo)) {
        mostrarToast('❌ Promoção indisponível hoje!', 'erro');
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
        ultimoItemAdicionado = promoId;
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    animarBotaoCarrinho();
    mostrarToast(`🎉 ${promo.nome} adicionada!`);
}

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
        ultimoItemAdicionado = produtoId;
    }

    salvarCarrinho();
    atualizarCarrinho();
    animarBotaoCarrinho();
    mostrarToast(`🍕 ${produto.nome} adicionada!`);
}

function removerDoCarrinho(produtoId) {
    const item = carrinho.find(item => item.id === produtoId);
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho();
    atualizarCarrinho();
    mostrarToast(`🗑️ ${item.nome} removida`);
}

function alterarQuantidade(produtoId, delta) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        const novaQuantidade = item.quantidade + delta;
        if (novaQuantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            item.quantidade = novaQuantidade;
            salvarCarrinho();
            atualizarCarrinho();
        }
    }
}

function atualizarCarrinho() {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    cartCount.textContent = totalItens;
    if (cartFloatingCount) {
        cartFloatingCount.textContent = totalItens;
    }
    
    if (window.innerWidth < 768 && totalItens > 0) {
        cartFloating.style.display = 'flex';
    } else {
        cartFloating.style.display = 'none';
    }

    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Seu carrinho está vazio</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Adicione pizzas deliciosas!</p>
            </div>
        `;
        cartTotal.textContent = 'R$ 0,00';
    } else {
        cartItems.innerHTML = carrinho.map(item => {
            const isNovo = ultimoItemAdicionado === item.id;
            return `
                <div class="cart-item ${isNovo ? 'highlight' : ''}">
                    <div class="cart-item-image">
                        <img src="${item.imagem}" alt="${item.nome}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513104890138-7c749660a47f?w=400&auto=format';">
                    </div>
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
            `;
        }).join('');

        const total = calcularTotal();
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        
        if (ultimoItemAdicionado) {
            setTimeout(() => {
                ultimoItemAdicionado = null;
            }, 1000);
        }
    }
}

function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarToast('❌ Carrinho vazio!', 'erro');
        return;
    }

    const total = calcularTotal();
    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');
    const diaAtual = getDiaAtual();

    let mensagem = '🍕 *UNIVERSIDAD DEL LA PIZZA*\n';
    mensagem += '═══════════════════════\n\n';
    mensagem += `📅 *Data:* ${dataFormatada}\n`;
    mensagem += `⏰ *Hora:* ${horaFormatada}\n`;
    mensagem += `📆 *Dia:* ${diaAtual.nome}-FEIRA\n\n`;
    mensagem += '*📋 PEDIDO:*\n';
    
    carrinho.forEach(item => {
        mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    
    mensagem += `\n *TOTAL: R$ ${total.toFixed(2)}*\n`;
    mensagem += '═══════════════════════\n\n';
    mensagem += '*📍 ENDEREÇO DE ENTREGA:*\n';
    mensagem += 'Mande Sua localização\n\n';
    mensagem += '* FORMA DE PAGAMENTO:*\n';
    mensagem += '▸ ( ) Dinheiro\n';
    mensagem += '▸ ( ) Cartão (débito/crédito)\n';
    mensagem += '▸ ( ) Pix\n\n';
    mensagem += '*HORÁRIO:*\n';
    mensagem += 'Seg a Qui: 19h às 00h\n';
    mensagem += 'Sex a Dom: até 01h\n\n';
    mensagem += '*Aguardando confirmação!*\n';
    mensagem += 'Obrigado pela preferência! ';

    const mensagemCodificada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagemCodificada}`, '_blank');
    
    mostrarToast('✅ Pedido enviado para o WhatsApp!');
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

// SCROLL SUAVE
const heroOrderBtn = document.getElementById('hero-order-btn');
if (heroOrderBtn) {
    heroOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cardapioSection = document.getElementById('cardapio');
        if (cardapioSection) {
            cardapioSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

const heroPromoBtn = document.getElementById('hero-promo-btn');
if (heroPromoBtn) {
    heroPromoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const promosSection = document.getElementById('promos');
        if (promosSection) {
            promosSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// RESIZE
window.addEventListener('resize', () => {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    if (window.innerWidth >= 768) {
        cartFloating.style.display = 'none';
    } else if (totalItens > 0) {
        cartFloating.style.display = 'flex';
    }
});

// ANIMAÇÃO BUMP
const style = document.createElement('style');
style.textContent = `
    .bump {
        animation: bump 0.3s ease;
    }
    @keyframes bump {
        0% { transform: scale(1); }
        30% { transform: scale(1.1); }
        50% { transform: scale(1.15); }
        70% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    .highlight {
        animation: highlight 1s ease;
    }
    @keyframes highlight {
        0% { background-color: rgba(212,175,55,0.2); }
        100% { background-color: transparent; }
    }
`;
document.head.appendChild(style);

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    mostrarPromocaoDia();
    mostrarPromocoesSemana();
    carregarProdutos();
});