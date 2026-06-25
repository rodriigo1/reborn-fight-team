export const metadata = {
    title: 'Horários & Preçário | Reborn Fight Team',
    description: 'Consulta os horários de aulas e preçário da Reborn Fight Team — MMA, BJJ e Muay Thai.',
};

export default function HorariosPage() {
    const horarios = {
        Segunda: [
            { hora: '17h30', modalidade: 'Muay Thai' },
            { hora: '19h', modalidade: 'MMA' },
            { hora: '20h40', modalidade: 'Jiu-Jitsu Adultos' },
        ],
        Terça: [
            { hora: '18h15', modalidade: 'Jiu-Jitsu Kids' },
            { hora: '19h20', modalidade: 'MMA' },
        ],
        Quarta: [
            { hora: '17h30', modalidade: 'Muay Thai' },
            { hora: '19h', modalidade: 'MMA' },
            { hora: '20h40', modalidade: 'Jiu-Jitsu Adultos' },
        ],
        Quinta: [
            { hora: '18h15', modalidade: 'Jiu-Jitsu Kids' },
            { hora: '19h20', modalidade: 'MMA' },
            { hora: '20h40', modalidade: 'Jiu-Jitsu Adultos' },
        ],
        Sexta: [
            { hora: '17h30', modalidade: 'Muay Thai' },
            { hora: '19h', modalidade: 'MMA' },
        ],
        Sábado: [
            { hora: '10h', modalidade: 'Jiu-Jitsu Kids' },
        ],
    };

    const getModClass = (mod) => {
        if (mod.includes('MMA')) return 'mma';
        if (mod.includes('Jiu-Jitsu')) return 'bjj';
        if (mod.includes('Muay')) return 'muaythai';
        return '';
    };

    return (
        <>
            {/* Header */}
            <div className="page-header">
                <div className="section-bg" style={{ backgroundImage: 'url(/images/hero-bg.png)' }} />
                <div className="container">
                    <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
                        Horários <span className="highlight">& Preçário</span>
                    </h1>
                    <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)', margin: '0 auto' }}>
                        Consulta os nossos horários de aulas e planos de mensalidade.
                    </p>
                </div>
            </div>

            {/* HORÁRIOS */}
            <section className="section-light-alt" id="horarios-section">
                <div className="container">
                    <div className="section-header center">
                        <h2 className="section-title">Horários</h2>
                    </div>
                    <div className="horarios-grid-v2">
                        {Object.entries(horarios).map(([dia, aulas]) => (
                            <div className="horario-dia-card" key={dia}>
                                <div className="horario-dia-nome">{dia}</div>
                                <div className="horario-dia-aulas">
                                    {aulas.map((aula, i) => (
                                        <div className={`horario-aula ${getModClass(aula.modalidade)}`} key={i}>
                                            <span className="horario-aula-hora">{aula.hora}</span>
                                            <span className="horario-aula-nome">{aula.modalidade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="horarios-nota">
                        Área de preparação física disponível em todos os horários.
                        <br />
                        PT's e Aulas Privadas por marcação.
                    </p>
                </div>
            </section>

            {/* PREÇÁRIO */}
            <section className="section-light" id="precario-section">
                <div className="container">
                    <div className="section-header center">
                        <h2 className="section-title">Preçário</h2>
                    </div>

                    {/* Info geral */}
                    <div className="precario-destaques">
                        <div className="precario-destaque">
                            <span className="precario-destaque-label">Inscrição</span>
                            <span className="precario-destaque-preco">30€</span>
                            <span className="precario-destaque-nota">inclui seguro anual obrigatório</span>
                        </div>
                        <div className="precario-destaque">
                            <span className="precario-destaque-label">Aula Experimental</span>
                            <span className="precario-destaque-preco">10€</span>
                            <span className="precario-destaque-nota">experimenta sem compromisso</span>
                        </div>
                        <div className="precario-destaque">
                            <span className="precario-destaque-label">Livre Trânsito</span>
                            <span className="precario-destaque-preco">60€</span>
                            <span className="precario-destaque-nota">acesso a todas as modalidades</span>
                        </div>
                    </div>

                    {/* Tabela de mensalidades */}
                    <div className="precario-tabela-wrapper">
                        <table className="precario-tabela">
                            <thead>
                                <tr>
                                    <th>Frequência</th>
                                    <th className="col-mma">MMA</th>
                                    <th className="col-bjj">BJJ Adultos</th>
                                    <th className="col-muaythai">Muay Thai</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="frequencia">2x por semana</td>
                                    <td>45,50€</td>
                                    <td>40,50€</td>
                                    <td>35,50€</td>
                                </tr>
                                <tr>
                                    <td className="frequencia">3x por semana</td>
                                    <td>50,50€</td>
                                    <td>45,50€</td>
                                    <td>40,50€</td>
                                </tr>
                                <tr>
                                    <td className="frequencia">+3x por semana</td>
                                    <td>55,50€</td>
                                    <td>50,50€</td>
                                    <td>—</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* BJJ Kids + Packs */}
                    <div className="precario-extras">
                        <div className="precario-extra-card">
                            <h3>BJJ Kids</h3>
                            <div className="precario-extra-precos">
                                <div className="precario-extra-linha">
                                    <span>2x por semana</span>
                                    <span className="preco">30€</span>
                                </div>
                                <div className="precario-extra-linha">
                                    <span>3x por semana</span>
                                    <span className="preco">40,50€</span>
                                </div>
                            </div>
                        </div>
                        <div className="precario-extra-card pack">
                            <h3>Pack Família 2PX</h3>
                            <p>Do mesmo agregado familiar</p>
                            <span className="preco-pack">Preço à escolha de ambos <strong>-10%</strong></span>
                        </div>
                        <div className="precario-extra-card pack">
                            <h3>Pack Família 3PX</h3>
                            <p>Do mesmo agregado familiar</p>
                            <span className="preco-pack">Preço à escolha de ambos <strong>-15%</strong></span>
                        </div>
                    </div>

                    <p className="precario-morada">
                        Av. dos Bombeiros Voluntários nº 10E, 1675-107 Pontinha
                    </p>
                </div>
            </section>
        </>
    );
}
