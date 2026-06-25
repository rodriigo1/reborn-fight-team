import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <>
            {/* HERO — Full screen com imagem de fundo */}
            <section className="hero" id="hero">
                <div className="hero-bg" style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }} />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            A Arte & O Estilo de Vida do <span className="highlight">Combate.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Treina MMA, BJJ e Muay Thai com instrutores experientes.
                            Descobre o teu potencial na Reborn Fight Team.
                        </p>
                    </div>
                    <div className="hero-btns">
                        <Link href="/horarios" className="btn btn-primario" id="btn-horarios">
                            Ver Horários
                        </Link>
                        <Link href="/sobre" className="btn btn-secundario" id="btn-sobre">
                            Saber Mais
                        </Link>
                    </div>
                </div>
            </section>

            {/* ABOUT — Secção clara com texto + imagem */}
            <section className="section-light" id="about">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <div className="section-header">
                                <h2 className="section-title">
                                    Sobre a <span className="highlight">Nossa Academia</span>
                                </h2>
                            </div>
                            <p>
                                Na <strong>Reborn Fight Team</strong>, acreditamos que o tatami é mais 
                                do que um lugar para treinar — é uma segunda casa. O nosso programa é 
                                construído com excelência técnica e foco na evolução real de cada aluno.
                            </p>
                            <p>
                                Mas o que torna este ginásio especial é a <strong>cultura</strong>. Uma 
                                comunidade acolhedora onde os membros se desafiam, crescem juntos e 
                                aparecem uns pelos outros todos os dias.
                            </p>
                            <p>
                                Seja o que te trouxe aqui — <strong>fitness, defesa pessoal, competição</strong> 
                                {' '}ou simplesmente curiosidade — vais encontrar o teu lugar connosco.
                            </p>
                            <div style={{ marginTop: '2rem' }}>
                                <Link href="/sobre" className="btn btn-outline-dark">
                                    Conhecer a Equipa →
                                </Link>
                            </div>
                        </div>
                        <div className="about-image">
                            <img src="/images/bjj.jpg" alt="Treino de BJJ na Reborn Fight Team" />
                        </div>
                    </div>
                </div>
            </section>

            {/* PROGRAMAS — Cards com imagem */}
            <section className="section-light-alt" id="programas">
                <div className="container">
                    <div className="section-header center">
                        <h2 className="section-title">
                            Programas de <span className="highlight">Treino</span>
                        </h2>
                        <p className="section-subtitle">
                            Três modalidades de combate, cada uma com a sua essência e filosofia.
                        </p>
                    </div>
                    <div className="programs-grid">
                        <div className="program-card" id="card-mma">
                            <img src="/images/mma.png" alt="MMA" />
                            <div className="program-card-overlay">
                                <h3 className="program-card-title">MMA</h3>
                                <p className="program-card-desc">
                                    Mixed Martial Arts — a arte mais completa. Técnicas de luta 
                                    em pé e no chão para o lutador mais versátil.
                                </p>
                            </div>
                        </div>
                        <div className="program-card" id="card-bjj">
                            <img src="/images/bjj.jpg" alt="BJJ" />
                            <div className="program-card-overlay">
                                <h3 className="program-card-title">Brazilian Jiu-Jitsu</h3>
                                <p className="program-card-desc">
                                    A arte suave — controlo no chão, submissões e 
                                    alavancas. O tamanho não importa.
                                </p>
                            </div>
                        </div>
                        <div className="program-card" id="card-muaythai">
                            <img src="/images/muaythai.png" alt="Muay Thai" />
                            <div className="program-card-overlay">
                                <h3 className="program-card-title">Muay Thai</h3>
                                <p className="program-card-desc">
                                    A arte dos oito membros — punhos, cotovelos, 
                                    joelhos e canelas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY TRAIN — Secção escura com imagem de fundo */}
            <section className="section-dark" id="vantagens">
                <div className="section-bg" style={{ backgroundImage: 'url(/images/tatami-bg.jpg)' }} />
                <div className="section-overlay" />
                <div className="container">
                    <div className="section-header center">
                        <h2 className="section-title">
                            Porquê Treinar <span className="highlight">Connosco?</span>
                        </h2>
                        <p className="section-subtitle">
                            Mais do que um ginásio. Uma família de lutadores.
                        </p>
                    </div>
                    <div className="why-grid">
                        <div className="why-card">
                            <div className="why-card-icon-text">I</div>
                            <h3 className="why-card-title">Instrutores de Elite</h3>
                            <p className="why-card-desc">
                                Profissionais certificados com experiência em competição internacional.
                            </p>
                        </div>
                        <div className="why-card">
                            <div className="why-card-icon-text">II</div>
                            <h3 className="why-card-title">Todos os Níveis</h3>
                            <p className="why-card-desc">
                                Aulas estruturadas para iniciantes, intermédios e avançados.
                            </p>
                        </div>
                        <div className="why-card">
                            <div className="why-card-icon-text">III</div>
                            <h3 className="why-card-title">Disciplina & Evolução</h3>
                            <p className="why-card-desc">
                                Cada treino é uma oportunidade de superação pessoal e crescimento.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA — Call to action com fundo sólido escuro */}
            <section className="cta-section" id="cta">
                <div className="container">
                    <h2 className="cta-title">Pronto para começar?</h2>
                    <p className="cta-subtitle">
                        Consulta os nossos horários e marca a tua primeira aula experimental.
                    </p>
                    <Link href="/horarios" className="btn btn-primario" id="btn-cta"
                        style={{ background: 'white', color: 'var(--cor-vermelho)' }}>
                        Consultar Horários
                    </Link>
                </div>
            </section>
        </>
    );
}
