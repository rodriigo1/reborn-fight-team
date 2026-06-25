// ============================================================
// components/Footer.js — Rodapé do Site
// ============================================================

'use client';
import Link from 'next/link';
import { useState } from 'react';

function CopyItem({ text, display }) {
    const [copiado, setCopiado] = useState(false);

    function copiar(e) {
        e.preventDefault();
        navigator.clipboard.writeText(text).then(() => {
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        });
    }

    return (
        <button
            onClick={copiar}
            title={copiado ? 'Copiado!' : 'Clica para copiar'}
            style={{
                display: 'block',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: copiado ? 'var(--cor-vermelho)' : 'rgba(255,255,255,0.5)',
                fontSize: '0.9rem',
                marginBottom: '0.6rem',
                padding: 0,
                textAlign: 'left',
                transition: 'color 0.2s ease',
                fontFamily: 'inherit',
            }}
        >
            {copiado ? '✓ Copiado!' : display}
        </button>
    );
}

export default function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Coluna 1 — Marca */}
                    <div className="footer-brand">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>
                                <span style={{ color: 'var(--cor-texto)' }}>REBORN </span>
                                <span style={{ color: 'var(--cor-primaria)' }}>FIGHT TEAM</span>
                            </h3>
                            <img src="/images/logo.jpg" alt="Reborn Logo" style={{ height: '55px', width: 'auto', borderRadius: '4px' }} />
                        </div>
                        <p>
                            Academia de artes marciais dedicada a formar lutadores
                            e a transformar vidas através do desporto de combate.
                        </p>
                    </div>

                    {/* Coluna 2 — Links rápidos */}
                    <div className="footer-section">
                        <h4>Navegação</h4>
                        <Link href="/">Início</Link>
                        <Link href="/horarios">Horários</Link>
                        <Link href="/sobre">Sobre Nós</Link>
                    </div>

                    {/* Coluna 3 — Contacto */}
                    <div className="footer-section">
                        <h4>Contacto</h4>
                        <CopyItem text="info@rebornfightteam.pt" display="info@rebornfightteam.pt" />
                        <CopyItem text="+351912345678" display="+351 912 345 678" />
                        <a
                            href="https://www.instagram.com/rebornfightteam/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram @rebornfightteam
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Reborn Fight Team. Todos os direitos reservados.</p>
                    <p style={{ marginTop: '0.25rem' }}>PAP — Técnico de Gestão e Programação de Sistemas Informáticos</p>
                </div>
            </div>
        </footer>
    );
}
