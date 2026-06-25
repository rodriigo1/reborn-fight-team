'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getProdutos } from '../../lib/api';
import { useCarrinho } from '../../components/CarrinhoProvider';

const CATEGORIAS = ['Todos', 'Equipamento/Proteção', 'Roupa'];
const TAMANHOS   = ['S', 'M', 'L', 'XL'];
const TAMANHOS_BUCAL = ['160cm-175cm', '175cm-185cm'];

// ── Arrays de cores ───────────────────────────────────────────────────────────
const RASHGUARD_CORES = [
    { nome: 'Branco',   valor: '#e0e0e0', imagem: '/images/rashguard-branco.png' },
    { nome: 'Azul',     valor: '#1a3dba', imagem: '/images/rashguard-azul.png' },
    { nome: 'Roxo',     valor: '#7B2D8E', imagem: '/images/rashguard-roxo.png' },
    { nome: 'Castanho', valor: '#6B4226', imagem: '/images/rashguard-castanho.jpg' },
    { nome: 'Preto',    valor: '#1a1a1a', imagem: '/images/rashguard-preto.png' },
];

const CALCOES_CORES = [
    { nome: 'Preto',         valor: '#1a1a1a', imagem: '/images/calcoes-pretos.jpg' },
    { nome: 'Branco / Creme',valor: '#e8e4d9', imagem: '/images/calcoes-brancos.jpg' },
];

const TSHIRT_REBORN_CORES = [
    { nome: 'Branco', valor: '#f5f5f5', imagem: '/images/tshirt-reborn-branca.png' },
    { nome: 'Preto',  valor: '#1a1a1a', imagem: '/images/tshirt-reborn-preta.png'  },
];

// ── Produtos estáticos de Roupa ───────────────────────────────────────────────
const ROUPA_ITEMS = [
    {
        id: 'static-rashguard', tabId: 'rashguard',
        nome: 'Rashguard Reborn', preco: 49.99,
        categoria: 'Roupa',
        descricao: 'Rashguard de compressão oficial Reborn Fight Team. Disponível em várias cores.',
        stock: 10, coresArr: RASHGUARD_CORES, imgSrc: null,
    },
    {
        id: 'static-make-over', tabId: 'make-over',
        nome: 'Make Over Reborn', preco: 34.99,
        categoria: 'Roupa',
        descricao: 'T-shirt oversize com design exclusivo Make Over Move Reborn. 100% algodão premium.',
        stock: 10, coresArr: null, imgSrc: '/images/tshirt-make-over-reborn.png',
    },
    {
        id: 'static-calcoes', tabId: 'calcoes',
        nome: 'Calções Reborn', preco: 39.99,
        categoria: 'Roupa',
        descricao: 'Calções de treino com padrão R exclusivo Reborn Fight Team. Disponível em duas cores.',
        stock: 10, coresArr: CALCOES_CORES, imgSrc: null,
    },
    {
        id: 'static-tshirt-reborn', tabId: 'tshirt-reborn',
        nome: 'T-Shirt Reborn', preco: 29.99,
        categoria: 'Roupa',
        descricao: 'T-shirt oversize Reborn Since 2016 / Building Fighters Since 2016. Disponível em branco e preto.',
        stock: 10, coresArr: TSHIRT_REBORN_CORES, imgSrc: null,
    },
    {
        id: 'static-unconquerable', tabId: 'unconquerable',
        nome: 'UNCONQUERABLE REBORN', preco: 34.99,
        categoria: 'Roupa',
        descricao: 'T-shirt preta com design exclusivo "Unconquerable" em arco. 100% algodão premium.',
        stock: 10, coresArr: null, imgSrc: '/images/tshirt-unconquerable.png',
    },
];

// ── Produto estático de Equipamento ───────────────────────────────────────────
const EQUIPAMENTO_ITEMS = [
    {
        id: 'static-luvas-mma', tabId: null,
        nome: 'Luvas de MMA REBORN', preco: 59.99,
        categoria: 'Equipamento/Proteção',
        descricao: 'Luvas de MMA oficiais Reborn Fight Team. Branco e dourado. Couro sintético de alta durabilidade.',
        stock: 10, coresArr: null, imgSrc: '/images/luvas-mma-reborn.jpg',
        tamanhos: TAMANHOS,
    },
];

// ── Cores de Proteção ─────────────────────────────────────────────────────────
const BUCAL_CORES = [
    { nome: 'Preto',  valor: '#1a1a1a', imagem: '/images/bocal-reborn-preto.png'  },
    { nome: 'Branco', valor: '#f5f5f5', imagem: '/images/bocal-reborn-branco.png' },
];

const CANELEIRAS_CORES = [
    { nome: 'Preto',  valor: '#1a1a1a', imagem: '/images/caneleiras-reborn-pretas.png'  },
    { nome: 'Branco', valor: '#f5f5f5', imagem: '/images/caneleiras-reborn-brancas.jpg' },
];

// ── Produtos estáticos de Proteção ────────────────────────────────────────────
const PROTECAO_ITEMS = [
    {
        id: 'static-bucal', tabId: null,
        nome: 'Bucal Reborn', preco: 24.99,
        categoria: 'Equipamento/Proteção',
        descricao: 'Bucal oficial Reborn Fight Team com encaixe personalizado. Disponível em preto e branco.',
        stock: 10, coresArr: BUCAL_CORES, imgSrc: null,
        tamanhos: TAMANHOS_BUCAL,
    },
    {
        id: 'static-caneleiras', tabId: null,
        nome: 'Caneleiras Reborn', preco: 44.99,
        categoria: 'Equipamento/Proteção',
        descricao: 'Caneleiras de proteção oficiais Reborn Fight Team. Couro sintético de alta resistência. Disponível em preto e branco.',
        stock: 10, coresArr: CANELEIRAS_CORES, imgSrc: null,
        tamanhos: TAMANHOS,
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function isRoupa(p) {
    return (p.categoria || '').toLowerCase() === 'roupa';
}

// ── Modal de Inspeção Completo ────────────────────────────────────────────────
function ModalInspecao({ produto, coresArr: coresArrInicial, corIdxInicial, onFechar, onAdicionarEstatico, onAdicionarBD, tamanhos }) {
    const [corIdx, setCorIdx]         = useState(corIdxInicial ?? 0);
    const [tamanho, setTamanho]       = useState('');
    const [erroTam, setErroTam]       = useState(false);
    const [adicionado, setAdicionado] = useState(false);
    const [zoomOn, setZoomOn]         = useState(false);
    const [lente, setLente]           = useState({ x: 0, y: 0, show: false });
    const imgRef = useRef(null);

    if (!produto) return null;

    const coresArr = coresArrInicial;
    const corAtual = coresArr ? coresArr[corIdx] : null;
    const imgSrc   = corAtual?.imagem || produto.imgSrc;
    const tamArr   = tamanhos || produto.tamanhos || ['S', 'M', 'L', 'XL'];
    const isEstatico = produto.id?.startsWith?.('static-') || produto.tabId !== undefined;

    function handleAdicionar() {
        if (!tamanho) { setErroTam(true); return; }
        if (isEstatico) {
            onAdicionarEstatico({ ...produto, coresArr }, corIdx, tamanho);
        } else {
            onAdicionarBD(produto, tamanho);
        }
        setAdicionado(true);
        setTimeout(() => setAdicionado(false), 1800);
    }

    function handleImgMove(e) {
        if (!zoomOn || !imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        setLente({ x, y, show: true });
    }
    function handleImgLeave() { setLente(prev => ({ ...prev, show: false })); }

    // Fechar com ESC
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onFechar(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onFechar]);

    // Reset zoom when color changes
    useEffect(() => { setZoomOn(false); setLente({ x: 0, y: 0, show: false }); }, [corIdx]);

    return (
        <div className="modal-inspecao-overlay" onClick={onFechar}>
            <div className="modal-inspecao-content" onClick={e => e.stopPropagation()}>
                <button className="modal-inspecao-fechar" onClick={onFechar} aria-label="Fechar">✕</button>
                <div className="modal-inspecao-grid">

                    {/* ── Lado esquerdo: Imagem com zoom ── */}
                    <div className="modal-inspecao-img-wrapper">
                        <div
                            className={`modal-inspecao-img ${zoomOn ? 'modal-img-zoom-on' : ''}`}
                            ref={imgRef}
                            onMouseMove={handleImgMove}
                            onMouseLeave={handleImgLeave}
                            onClick={() => imgSrc && setZoomOn(z => !z)}
                            style={{ cursor: imgSrc ? (zoomOn ? 'zoom-out' : 'zoom-in') : 'default' }}
                        >
                            {imgSrc ? (
                                <img
                                    src={imgSrc}
                                    alt={produto.nome}
                                    className="modal-img-principal"
                                    style={zoomOn && lente.show ? {
                                        transformOrigin: `${lente.x}% ${lente.y}%`,
                                        transform: 'scale(2.5)',
                                    } : {}}
                                />
                            ) : (
                                <div className="modal-sem-imagem">
                                    <span style={{ fontSize: '3rem' }}>📦</span>
                                    <p>Sem imagem disponível</p>
                                </div>
                            )}
                            {imgSrc && (
                                <div className="modal-zoom-hint">
                                    {zoomOn ? (
                                        <><span>🔍</span> Clica para sair do zoom</>
                                    ) : (
                                        <><span>🔍</span> Clica para ampliar · Move o rato para explorar</>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Miniaturas de cor como galeria */}
                        {coresArr && coresArr.length > 1 && (
                            <div className="modal-galeria-thumbs">
                                {coresArr.map((cor, i) => (
                                    <button
                                        key={cor.nome}
                                        className={`modal-thumb ${corIdx === i ? 'modal-thumb-ativa' : ''}`}
                                        onClick={() => setCorIdx(i)}
                                        title={cor.nome}
                                        style={{ backgroundColor: cor.valor }}
                                    >
                                        {cor.imagem && (
                                            <img src={cor.imagem} alt={cor.nome} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Lado direito: Detalhes e opções ── */}
                    <div className="modal-inspecao-detalhes">
                        <span className="modal-inspecao-categoria">{produto.categoria}</span>
                        <h2 className="modal-inspecao-nome">{produto.nome}</h2>
                        <p className="modal-inspecao-preco">{produto.preco?.toFixed(2)}€</p>
                        <p className="modal-inspecao-desc">{produto.descricao}</p>

                        {/* ── Seletor de Cor ── */}
                        {coresArr && (
                            <div className="modal-seletor-grupo">
                                <span className="modal-seletor-label">
                                    Cor: <strong>{coresArr[corIdx].nome}</strong>
                                </span>
                                <div className="modal-cor-opcoes">
                                    {coresArr.map((cor, i) => (
                                        <button
                                            key={cor.nome}
                                            className={`modal-cor-btn ${corIdx === i ? 'modal-cor-ativa' : ''}`}
                                            style={{ backgroundColor: cor.valor }}
                                            onClick={() => setCorIdx(i)}
                                            title={cor.nome}
                                            aria-label={`Cor ${cor.nome}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Seletor de Tamanho ── */}
                        <div className="modal-seletor-grupo">
                            <span className="modal-seletor-label">Tamanho:</span>
                            <div className="modal-tamanho-opcoes">
                                {tamArr.map(t => (
                                    <button
                                        key={t}
                                        className={`modal-tamanho-btn ${tamanho === t ? 'modal-tamanho-ativo' : ''}`}
                                        onClick={() => { setTamanho(t); setErroTam(false); }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            {erroTam && <span className="modal-erro-tam">⚠ Seleciona um tamanho</span>}
                        </div>

                        {/* ── Stock ── */}
                        <p className="modal-stock">
                            {(produto.stock ?? 10) > 0
                                ? `✓ ${produto.stock ?? 10} em stock`
                                : '✗ Esgotado'}
                        </p>

                        {/* ── Botão Adicionar ── */}
                        <button
                            className={`modal-btn-adicionar ${adicionado ? 'modal-btn-adicionado' : ''}`}
                            onClick={handleAdicionar}
                            disabled={(produto.stock ?? 10) <= 0}
                        >
                            {adicionado ? '✓ Adicionado ao Carrinho!' : 'Adicionar ao Carrinho'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LojaPage() {
    const [produtos, setProdutos]           = useState([]);
    const [categoria, setCategoria]         = useState('Todos');
    const [loading, setLoading]             = useState(true);
    const [adicionado, setAdicionado]       = useState(null);
    const [coresSel, setCoresSel]           = useState({});
    const [tamanhosSel, setTamanhosSel]     = useState({});
    const [erroTamanho, setErroTamanho]     = useState({});
    const [modalProduto, setModalProduto]   = useState(null); // { cfg, coresArr, corIdx }
    const { adicionar, numItens }           = useCarrinho();

    useEffect(() => {
        async function carregar() {
            setLoading(true);
            const dados = await getProdutos('');
            setProdutos(dados.filter(p => !isRoupa(p)));
            setLoading(false);
        }
        carregar();
    }, []);

    // ── Selectors ─────────────────────────────────────────────────────────────
    function getCorIdx(id)      { return coresSel[id]   ?? 0; }
    function getTamanho(id)     { return tamanhosSel[id] ?? ''; }

    function selecionarCor(id, i) {
        setCoresSel(prev => ({ ...prev, [id]: i }));
    }
    function selecionarTamanho(id, t) {
        setTamanhosSel(prev => ({ ...prev, [id]: t }));
        setErroTamanho(prev => ({ ...prev, [id]: false }));
    }

    // ── Adicionar ao carrinho (estáticos) — usado nos cards ──────────────────
    function adicionarEstatico(cfg) {
        const { id, nome, preco, coresArr } = cfg;
        const tamanho = getTamanho(id);
        if (!tamanho) {
            setErroTamanho(prev => ({ ...prev, [id]: true }));
            return;
        }
        const dadosCarrinho = { id, nome, preco, tamanho };
        if (coresArr) {
            const cor = coresArr[getCorIdx(id)];
            dadosCarrinho.cor      = cor.nome;
            dadosCarrinho.corValor = cor.valor;
        }
        adicionar(dadosCarrinho);
        const chave = dadosCarrinho.cor
            ? `${id}_${dadosCarrinho.cor}_${tamanho}`
            : `${id}_${tamanho}`;
        setAdicionado(chave);
        setTimeout(() => setAdicionado(null), 1500);
    }

    // ── Adicionar ao carrinho (estáticos) — usado no MODAL ───────────────────
    function adicionarEstaticoModal(cfg, corIdxModal, tamanhoModal) {
        const { id, nome, preco, coresArr } = cfg;
        const dadosCarrinho = { id, nome, preco, tamanho: tamanhoModal };
        if (coresArr) {
            const cor = coresArr[corIdxModal];
            dadosCarrinho.cor      = cor.nome;
            dadosCarrinho.corValor = cor.valor;
        }
        adicionar(dadosCarrinho);
    }

    // ── Adicionar ao carrinho (BD) — usado no MODAL ───────────────────────────
    function adicionarBDModal(produto, tamanhoModal) {
        adicionar({ id: produto.id, nome: produto.nome, preco: produto.preco, tamanho: tamanhoModal });
    }

    // ── Adicionar ao carrinho (BD) ────────────────────────────────────────────
    function adicionarBD(produto) {
        const tamanho = getTamanho(produto.id);
        if (!tamanho) {
            setErroTamanho(prev => ({ ...prev, [produto.id]: true }));
            return;
        }
        const dadosCarrinho = { id: produto.id, nome: produto.nome, preco: produto.preco, tamanho };
        adicionar(dadosCarrinho);
        const chave = `${produto.id}_${tamanho}`;
        setAdicionado(chave);
        setTimeout(() => setAdicionado(null), 1500);
    }

    // ── Render de produto estático (card limpo — detalhes no modal) ──────────
    function renderEstatico(cfg) {
        const { id, nome, preco, categoria: cat, coresArr, imgSrc } = cfg;
        const corIdx   = getCorIdx(id);
        const corAtual = coresArr ? coresArr[corIdx] : null;

        return (
            <div key={id} className="produto-card produto-card-clean" onClick={() => setModalProduto({ cfg, coresArr, corIdx })}>
                <div className="produto-imagem produto-imagem-clicavel">
                    {corAtual ? (
                        <img src={corAtual.imagem} alt={`${nome} - ${corAtual.nome}`} />
                    ) : imgSrc ? (
                        <img src={imgSrc} alt={nome} />
                    ) : (
                        <div className="produto-placeholder">RFT</div>
                    )}
                    <span className="produto-categoria">{cat}</span>
                    <div className="produto-lupa">🔍</div>
                </div>
                <div className="produto-info produto-info-clean">
                    <h3>{nome}</h3>
                    <span className="produto-preco">{preco.toFixed(2)}€</span>
                </div>
            </div>
        );
    }

    // ── Render de produto da BD (card limpo — detalhes no modal) ─────────────
    function renderBD(produto) {
        return (
            <div key={produto.id} className="produto-card produto-card-clean" onClick={() => setModalProduto({ cfg: { ...produto, imgSrc: null }, coresArr: null, corIdx: 0 })}>
                <div className="produto-imagem produto-imagem-clicavel">
                    <div className="produto-placeholder" style={{ fontSize: '2.5rem', opacity: 0.25 }}>RFT</div>
                    <span className="produto-categoria">{produto.categoria}</span>
                    <div className="produto-lupa">🔍</div>
                </div>
                <div className="produto-info produto-info-clean">
                    <h3>{produto.nome}</h3>
                    <span className="produto-preco">{produto.preco?.toFixed(2)}€</span>
                </div>
            </div>
        );
    }

    // ── Filtrar itens visíveis ────────────────────────────────────────────────
    const mostrarRoupa               = categoria === 'Todos' || categoria === 'Roupa';
    const mostrarEquipamentoProtecao = categoria === 'Todos' || categoria === 'Equipamento/Proteção';

    const produtosBD = produtos.filter(p => {
        if (categoria === 'Todos')       return true;
        if (categoria === 'Roupa')       return false;
        const catBD = (p.categoria || '').toLowerCase();
        if (categoria === 'Equipamento/Proteção') {
            return catBD === 'equipamento' || catBD === 'proteção' || catBD === 'equipamento/proteção';
        }
        return catBD === categoria.toLowerCase();
    });

    return (
        <>
            {/* Modal de inspeção */}
            {modalProduto && (
                <ModalInspecao
                    produto={modalProduto.cfg}
                    coresArr={modalProduto.coresArr}
                    corIdxInicial={modalProduto.corIdx}
                    tamanhos={modalProduto.cfg?.tamanhos || null}
                    onFechar={() => setModalProduto(null)}
                    onAdicionarEstatico={adicionarEstaticoModal}
                    onAdicionarBD={adicionarBDModal}
                />
            )}

            {/* Header */}
            <section className="page-header">
                <h1>LOJA <span className="text-accent">REBORN</span></h1>
                <p>Equipamento oficial para o teu treino</p>
            </section>

            {/* Conteúdo */}
            <section className="section-light" style={{ paddingBottom: '80px' }}>
                <div className="container">
                    {/* Carrinho flutuante */}
                    {numItens > 0 && (
                        <Link href="/carrinho" className="carrinho-flutuante">
                            Carrinho ({numItens})
                        </Link>
                    )}

                    {/* Filtros de categoria */}
                    <div className="filtros-loja">
                        {CATEGORIAS.map(cat => (
                            <button
                                key={cat}
                                className={`filtro-btn ${categoria === cat ? 'ativo' : ''}`}
                                onClick={() => setCategoria(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>A carregar produtos...</p>
                        </div>
                    ) : (
                        <>
                            {/* ── SECÇÃO EQUIPAMENTO/PROTEÇÃO ──────────────── */}
                            {mostrarEquipamentoProtecao && (
                                <div className="roupa-section">
                                    <h2 className="roupa-section-title">
                                        <span className="text-accent">●</span> Equipamento/Proteção
                                    </h2>
                                    <div className="produtos-grid">
                                        {EQUIPAMENTO_ITEMS.map(item => renderEstatico(item))}
                                        {PROTECAO_ITEMS.map(item => renderEstatico(item))}
                                        {produtosBD
                                            .filter(p => {
                                                const c = (p.categoria || '').toLowerCase();
                                                return c === 'equipamento' || c === 'proteção' || c === 'equipamento/proteção';
                                            })
                                            .map(p => renderBD(p))
                                        }
                                    </div>
                                </div>
                            )}

                            {/* ── SECÇÃO ROUPA ──────────────────────────────── */}
                            {mostrarRoupa && (
                                <div className="roupa-section" style={{ marginTop: mostrarEquipamentoProtecao ? '3rem' : '0' }}>
                                    <h2 className="roupa-section-title">
                                        <span className="text-accent">●</span> Roupa
                                    </h2>
                                    <div className="produtos-grid">
                                        {ROUPA_ITEMS.map(item => renderEstatico(item))}
                                    </div>
                                </div>
                            )}

                            {/* ── OUTROS PRODUTOS DA BD ── */}
                            {categoria === 'Todos' && produtosBD.filter(p => {
                                const c = (p.categoria || '').toLowerCase();
                                return c !== 'equipamento' && c !== 'proteção' && c !== 'equipamento/proteção' && c !== 'roupa';
                            }).length > 0 && (
                                <div className="roupa-section" style={{ marginTop: '3rem' }}>
                                    <h2 className="roupa-section-title">
                                        <span className="text-accent">●</span> Outros
                                    </h2>
                                    <div className="produtos-grid">
                                        {produtosBD
                                            .filter(p => {
                                                const c = (p.categoria || '').toLowerCase();
                                                return c !== 'equipamento' && c !== 'proteção' && c !== 'equipamento/proteção' && c !== 'roupa';
                                            })
                                            .map(p => renderBD(p))
                                        }
                                    </div>
                                </div>
                            )}

                            {!loading &&
                             !mostrarRoupa &&
                             !mostrarEquipamentoProtecao &&
                             produtosBD.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999', padding: '60px 0' }}>
                                    Nenhum produto encontrado nesta categoria.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
