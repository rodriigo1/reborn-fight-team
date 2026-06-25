// ============================================================
// config/email.js — Configuração do envio de emails
// ============================================================
// Usa o Nodemailer para enviar emails reais via Gmail SMTP.
//
// CONCEITO IMPORTANTE: "SMTP" (Simple Mail Transfer Protocol)
// É o protocolo que os servidores de email usam para enviar
// mensagens. O Gmail tem um servidor SMTP que podemos usar
// para enviar emails automaticamente pelo nosso código.
//
// Para funcionar, precisa de uma "App Password" do Gmail
// (não a password normal da conta).
// ============================================================

const nodemailer = require('nodemailer');

// ----------------------------------------------------------
// Criar transporter fresco (usa sempre os valores atuais do .env)
// ----------------------------------------------------------
function criarTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,         // rodrigobs569@gmail.com
            pass: process.env.GMAIL_APP_PASSWORD,  // App Password de 16 caracteres
        },
    });
}

// ----------------------------------------------------------
// Enviar email de verificação
// ----------------------------------------------------------
async function enviarEmailVerificacao(email, nome, token) {
    const linkVerificacao = `http://localhost:3000/verificar?token=${token}`;

    console.log(`📧 A enviar email de verificação para: ${email}`);
    console.log(`🔗 Link de ativação (para testes): ${linkVerificacao}`);

    const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: #0d0d0d; padding: 30px; text-align: center; }
            .header h1 { color: white; font-size: 22px; margin: 0; letter-spacing: 2px; }
            .header span { color: #c41e2a; }
            .body { padding: 30px; }
            .body h2 { color: #1a1a1a; margin-bottom: 10px; }
            .body p { color: #666; line-height: 1.6; }
            .btn { display: inline-block; padding: 14px 32px; background: #c41e2a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
            .footer { padding: 20px 30px; background: #f9f9f9; text-align: center; color: #999; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>REBORN <span>FIGHT TEAM</span></h1>
            </div>
            <div class="body">
                <h2>Olá, ${nome}! 👋</h2>
                <p>Bem-vindo à Reborn Fight Team! Para concluíres o teu registo, precisa de confirmar o teu email.</p>
                <p>Clica no botão abaixo para verificar a tua conta:</p>
                <a href="${linkVerificacao}" class="btn">Verificar Email</a>
                <p style="font-size: 13px; color: #999;">Se não foste tu a criar esta conta, ignora este email.</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Reborn Fight Team — Academia de Artes Marciais</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const transporter = criarTransporter();

    const resultado = await transporter.sendMail({
        from: `"Reborn Fight Team" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: '🥊 Verifica o teu email — Reborn Fight Team',
        html: htmlEmail,
    });

    console.log(`✅ Email enviado com sucesso para: ${email} (ID: ${resultado.messageId})`);
}

module.exports = { enviarEmailVerificacao };
