'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useCarrinho } from './CarrinhoProvider';

export default function Navbar() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [mostrarModalLogout, setMostrarModalLogout] = useState(false);
    const pathname = usePathname();
    const { utilizador, fazerLogout } = useAuth();
    const { numItens } = useCarrinho();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClick = () => setDropdown(false);
        if (dropdown) document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [dropdown]);

    function confirmarLogout() {
        fazerLogout();
        setMostrarModalLogout(false);
        setDropdown(false);
    }

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    <Link href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div>REBORN <span>FIGHT TEAM</span></div>
                        <img src="/images/logo.jpg" alt="Reborn Fight Team Logo" style={{ height: '55px', width: 'auto', borderRadius: '4px' }} />
                    </Link>

                    <div className={`navbar-links ${menuAberto ? 'aberto' : ''}`}>
                        <Link href="/" className={pathname === '/' ? 'ativo' : ''} onClick={() => setMenuAberto(false)}>
                            Início
                        </Link>
                        <Link href="/horarios" className={pathname === '/horarios' ? 'ativo' : ''} onClick={() => setMenuAberto(false)}>
                            Horários
                        </Link>
                        <Link href="/loja" className={pathname.startsWith('/loja') ? 'ativo' : ''} onClick={() => setMenuAberto(false)}>
                            Loja
                        </Link>
                        <Link href="/sobre" className={pathname === '/sobre' ? 'ativo' : ''} onClick={() => setMenuAberto(false)}>
                            Sobre
                        </Link>
                    </div>

                    <div className="navbar-acoes">
                        {/* Carrinho */}
                        <Link href="/carrinho" className="navbar-carrinho">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            {numItens > 0 && <span className="carrinho-badge">{numItens}</span>}
                        </Link>

                        {/* Auth */}
                        {utilizador ? (
                            <div className="navbar-user" onClick={e => { e.stopPropagation(); setDropdown(!dropdown); }}>
                                <div className="navbar-user-avatar">
                                    {utilizador.fotoUrl
                                        ? <img src={utilizador.fotoUrl} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                        : utilizador.nome?.charAt(0).toUpperCase()
                                    }
                                </div>
                                <span className="navbar-user-nome">{utilizador.nome?.split(' ')[0]}</span>
                                {dropdown && (
                                    <div className="navbar-dropdown">
                                        <p className="dropdown-email">{utilizador.email}</p>
                                        <Link href="/perfil" onClick={() => setDropdown(false)}>Perfil</Link>
                                        <button onClick={(e) => { e.stopPropagation(); setDropdown(false); setMostrarModalLogout(true); }}>Sair</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="btn-entrar">Entrar</Link>
                        )}
                    </div>

                    <button className="navbar-toggle" onClick={() => setMenuAberto(!menuAberto)}>
                        {menuAberto ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Modal de confirmação de Logout */}
            {mostrarModalLogout && (
                <div className="modal-overlay" onClick={() => setMostrarModalLogout(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon-svg">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--cor-vermelho)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        </div>
                        <h3 className="modal-titulo">Sair da Conta</h3>
                        <p className="modal-texto">Deseja mesmo sair da sua conta?</p>
                        <div className="modal-acoes">
                            <button className="btn-modal btn-modal-cancelar" onClick={() => setMostrarModalLogout(false)}>
                                Não, ficar
                            </button>
                            <button className="btn-modal btn-modal-confirmar" onClick={confirmarLogout}>
                                Sim, sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
