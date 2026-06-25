export const metadata = {
    title: 'Sobre Nós | Reborn Fight Team',
    description: 'Conhece a história, valores e instrutores da Reborn Fight Team.',
};

export default function SobrePage() {
    const instrutores = [
        {
            id: 'aires-benros',
            nome: 'Aires Benros',
            modalidade: 'Brazilian Jiu-Jitsu',
            foto: '/images/instrutor-bjj.jpg',
            bio: 'O Mestre Aires Benros é um apaixonado pelo Jiu-Jitsu Brasileiro. Com anos de dedicação ao tatami, desenvolveu um estilo de ensino único que combina técnica refinada com uma abordagem acessível. Acredita que o BJJ é mais do que uma arte marcial — é um caminho de vida que transforma corpo e mente.',
            instagram: 'https://www.instagram.com/airesbenros/',
            cor: 'var(--cor-bjj)',
        },
        {
            id: 'artur-lemos',
            nome: 'Artur Lemos',
            modalidade: 'MMA',
            foto: '/images/instrutor-mma.png',
            bio: 'O Mestre Artur Lemos é um lutador completo com vasta experiência em Mixed Martial Arts. A sua filosofia de treino foca-se na versatilidade e adaptação, preparando os seus alunos para qualquer situação. Com um historial impressionante no mundo das artes marciais mistas, inspira todos os que treinam com ele.',
            instagram: 'https://www.instagram.com/arturwilliaml/',
            cor: 'var(--cor-mma)',
        },
        {
            id: 'helson-henriques',
            nome: 'Helson Henriques',
            modalidade: 'Muay Thai',
            foto: '/images/instrutor-muaythai.jpg',
            bio: 'O Mestre Helson Henriques é um especialista na arte dos oito membros — o Muay Thai. Com uma técnica afiada e uma paixão contagiante pela modalidade, transforma cada treino numa experiência intensa e gratificante. Conhecido pela sua dedicação aos alunos, ensina com disciplina e respeito pela tradição tailandesa.',
            instagram: 'https://www.instagram.com/helsonhenriques/',
            cor: 'var(--cor-muaythai)',
        },
    ];

    return (
        <>
            {/* Header */}
            <div className="page-header">
                <div className="section-bg" style={{ backgroundImage: 'url(/images/why-train-bg.png)' }} />
                <div className="container">
                    <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
                        Sobre <span className="highlight">Nós</span>
                    </h1>
                    <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)', margin: '0 auto' }}>
                        Mais do que um ginásio, somos uma família de lutadores.
                    </p>
                </div>
            </div>

            {/* About */}
            <section className="section-light">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <div className="section-header">
                                <h2 className="section-title">
                                    Nascemos da Paixão pelo <span className="highlight">Combate</span>
                                </h2>
                            </div>
                            <p>
                                A <strong>Reborn Fight Team</strong> nasceu com a missão de criar um 
                                espaço onde qualquer pessoa pode treinar artes marciais, independentemente 
                                do nível de experiência.
                            </p>
                            <p>
                                Acreditamos que o treino de artes marciais vai muito além da luta — é sobre 
                                <strong> disciplina, respeito, superação pessoal</strong> e comunidade. Cada 
                                treino é uma oportunidade de te tornares uma versão melhor de ti.
                            </p>
                            <p>
                                Com instrutores experientes e um ambiente acolhedor, oferecemos aulas de 
                                MMA, BJJ e Muay Thai para todos os níveis. O teu percurso começa aqui.
                            </p>
                        </div>
                        <div className="about-image">
                            <img src="/images/mma.png" alt="Treino na Reborn Fight Team" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores */}
            <section className="section-dark" id="valores">
                <div className="section-bg" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }} />
                <div className="section-overlay" />
                <div className="container">
                    <div className="section-header center">
                        <h2 className="section-title">Os Nossos <span className="highlight">Valores</span></h2>
                    </div>
                    <div className="why-grid">
                        <div className="why-card">
                            <div className="why-card-icon-text">01</div>
                            <h3 className="why-card-title">Disciplina</h3>
                            <p className="why-card-desc">A consistência no treino constrói o carácter e a determinação.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-card-icon-text">02</div>
                            <h3 className="why-card-title">Respeito</h3>
                            <p className="why-card-desc">Respeito pelo parceiro, pelo instrutor e por ti mesmo.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-card-icon-text">03</div>
                            <h3 className="why-card-title">Superação</h3>
                            <p className="why-card-desc">Todos os dias ultrapassamos os nossos limites no tatami.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instrutores */}
            <section className="section-light-alt" id="instrutores">
                <div className="container">
                    <div className="section-header center">
                        <h2 className="section-title">Os Nossos <span className="highlight">Mestres</span></h2>
                        <p className="section-subtitle">Profissionais dedicados à tua evolução dentro e fora do tatami.</p>
                    </div>
                    <div className="instrutores-grid-v2">
                        {instrutores.map((inst) => (
                            <div key={inst.id} className="instrutor-card-v2" id={`instrutor-${inst.id}`}>
                                <div className="instrutor-foto-wrapper">
                                    <img src={inst.foto} alt={`Mestre ${inst.nome}`} className="instrutor-foto" />
                                    <div className="instrutor-foto-overlay" />
                                    <span className="instrutor-modalidade-badge" style={{ background: inst.cor }}>
                                        {inst.modalidade}
                                    </span>
                                </div>
                                <div className="instrutor-info-v2">
                                    <h3 className="instrutor-nome-v2">{inst.nome}</h3>
                                    <p className="instrutor-modalidade-v2" style={{ color: inst.cor }}>{inst.modalidade}</p>
                                    <p className="instrutor-bio-v2">{inst.bio}</p>
                                    <a 
                                        href={inst.instagram} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn-conhecer"
                                        style={{ borderColor: inst.cor, color: inst.cor }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                        Conhece-me melhor
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
