'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
    const [itens, setItens] = useState([]);

    // Carregar carrinho do localStorage ao iniciar
    useEffect(() => {
        const guardado = localStorage.getItem('carrinho');
        if (guardado) {
            try { setItens(JSON.parse(guardado)); } catch { }
        }
    }, []);

    // Guardar no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('carrinho', JSON.stringify(itens));
    }, [itens]);

    // Gerar chave única para item (id + cor + tamanho)
    function chaveItem(item) {
        const cor     = item.cor      || '';
        const tamanho = item.tamanho  || '';
        return `${item.id}_${cor}_${tamanho}`;
    }

    // Adicionar produto ao carrinho
    function adicionar(produto) {
        setItens(prev => {
            const existente = prev.find(item =>
                item.id === produto.id &&
                (item.cor      || '') === (produto.cor      || '') &&
                (item.tamanho  || '') === (produto.tamanho  || '')
            );
            if (existente) {
                return prev.map(item =>
                    item.id === produto.id &&
                    (item.cor      || '') === (produto.cor      || '') &&
                    (item.tamanho  || '') === (produto.tamanho  || '')
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            }
            return [...prev, { ...produto, quantidade: 1 }];
        });
    }

    // Remover produto (por id + cor + tamanho)
    function remover(produtoId, cor, tamanho) {
        setItens(prev => prev.filter(item =>
            !(item.id === produtoId &&
              (item.cor     || '') === (cor     || '') &&
              (item.tamanho || '') === (tamanho || ''))
        ));
    }

    // Atualizar quantidade (por id + cor + tamanho)
    function atualizarQuantidade(produtoId, quantidade, cor, tamanho) {
        if (quantidade <= 0) {
            remover(produtoId, cor, tamanho);
            return;
        }
        setItens(prev =>
            prev.map(item =>
                item.id === produtoId &&
                (item.cor     || '') === (cor     || '') &&
                (item.tamanho || '') === (tamanho || '')
                    ? { ...item, quantidade }
                    : item
            )
        );
    }

    // Limpar carrinho
    function limpar() {
        setItens([]);
    }

    // Total
    const total    = itens.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    const numItens = itens.reduce((soma, item) => soma + item.quantidade, 0);

    return (
        <CarrinhoContext.Provider value={{ itens, total, numItens, adicionar, remover, atualizarQuantidade, limpar }}>
            {children}
        </CarrinhoContext.Provider>
    );
}

export function useCarrinho() {
    const context = useContext(CarrinhoContext);
    if (!context) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
    return context;
}
