# 🥊 Reborn Fight Team — Plataforma Digital (PAP)

> **Prova de Aptidão Profissional (PAP)**  
> **Autor:** Rodrigo  
> **Tema:** Desenvolvimento de uma plataforma digital (Website e API) para a academia de artes marciais *Reborn Fight Team*.

---

## 📌 Sobre o Projeto

Este projeto consiste numa plataforma digital completa desenvolvida para a academia **Reborn Fight Team** (especializada em MMA, Jiu-Jitsu Brasileiro e Muay Thai). A plataforma visa modernizar a comunicação entre treinadores e alunos, organizar os horários de treinos, e disponibilizar uma loja online oficial para a venda de equipamentos e vestuário da equipa com pagamentos integrados.

---

## 🚀 Principais Funcionalidades

### 🌐 Frontend (Área Pública & Aluno)
- **Página Inicial:** Apresentação da academia, valores, modalidade e treinadores.
- **Horários Interativos:** Tabela dinâmica alimentada pela base de dados, permitindo consultar horários por dia da semana e modalidade.
- **Autenticação:** Registo de utilizadores, Login tradicional com hash seguro de passwords e login alternativo através da **Google (OAuth 2.0)**.
- **Loja Online:** Visualização de produtos por categorias, modal de inspeção detalhada de produtos com seletores dinâmicos de cor e tamanho.
- **Carrinho de Compras:** Gestão local de itens, controlo de quantidade e cálculo automático de taxas (IVA e envio).
- **Checkout Seguro:** Integração com o **Stripe** para processamento real de pagamentos.
- **Painel de Perfil:** Atualização de dados pessoais, upload de imagem de perfil (persistida em base de dados) e histórico de encomendas realizadas.

### ⚙️ Backend (API REST)
- **Autenticação Segura:** Middleware de proteção de rotas com **JSON Web Tokens (JWT)**.
- **Email de Ativação:** Verificação obrigatória de novas contas via **Nodemailer** com link temporário enviado para o email do utilizador.
- **Transações na Base de Dados:** Criação de encomendas e atualização automática do stock físico na tabela de produtos após confirmação de pagamento.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Framework:** [Next.js (React)](https://nextjs.org/)
- **Estilização:** Vanilla CSS (CSS3 Avançado com design responsivo e efeitos modernos de hover/glassmorphism)
- **Estado:** React Context API (Gestão de Carrinho e Autenticação)

### Backend
- **Ambiente de Execução:** [Node.js](https://nodejs.org/)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **Autenticação:** Passport.js (Google OAuth) & jsonwebtoken (JWT)
- **Comunicações:** Nodemailer (SMTP Gmail)
- **Integração de Pagamentos:** Stripe SDK

### Base de Dados
- **Motor:** [Microsoft SQL Server 2022 (Express Edition)](https://www.microsoft.com/pt-pt/sql-server/sql-server-downloads)
- **Acesso a Dados:** Pacote oficial `mssql` para Node.js com controlo de conexões persistentes (Pooling).

---

## 📂 Estrutura do Repositório

```text
PAP_rebornfightteam/
├── backend/            # API REST (Node.js/Express)
│   ├── config/         # Conexões a Bases de Dados e Emails
│   ├── controllers/    # Lógica de negócio e tratamento de pedidos
│   ├── middleware/     # Autenticação JWT e CORS
│   ├── models/         # Consultas SQL e interações com a BD
│   ├── routes/         # Rotas/Endpoints HTTP da API
│   └── server.js       # Ponto de entrada do servidor backend
│
├── website/            # Aplicação Frontend (Next.js)
│   ├── public/         # Recursos estáticos (Imagens, Vídeos, Logos)
│   ├── src/
│   │   ├── app/        # Páginas do Next.js (App Router)
│   │   └── components/ # Componentes reutilizáveis (Navbar, Footer, Providers)
│   └── package.json
│
└── database/           # Scripts SQL Server (Ficheiros .sql)
    ├── schema.sql      # Esquema e dados de exemplo iniciais
    └── migrations/     # Scripts de atualização e alterações da BD
```

---

## ⚙️ Instalação e Configuração

### 1. Base de Dados (SQL Server)
1. Instala o **SQL Server Express** e o **SQL Server Management Studio (SSMS)**.
2. Executa o script [schema.sql](database/schema.sql) para criar a base de dados `RebornFightTeam` e as tabelas necessárias (`utilizadores`, `produtos`, `encomendas`, `horarios`, etc.).
3. Se necessário, aplica os ficheiros de migração da pasta `database/`.

### 2. Configurar o Backend
1. Navega para a pasta `backend/`:
   ```bash
   cd backend
   ```
2. Instala as dependências:
   ```bash
   npm install
   ```
3. Cria um ficheiro `.env` na raiz da pasta `backend/` com as seguintes variáveis:
   ```env
   PORT=3001
   DB_USER=o_teu_utilizador_db
   DB_PASSWORD=a_tua_password_db
   DB_SERVER=localhost
   DB_DATABASE=RebornFightTeam
   JWT_SECRET=chave_secreta_jwt
   GOOGLE_CLIENT_ID=o_teu_google_client_id
   GOOGLE_CLIENT_SECRET=o_teu_google_client_secret
   GMAIL_USER=rodrigobs569@gmail.com
   GMAIL_APP_PASSWORD=a_tua_app_password_gmail
   STRIPE_SECRET_KEY=a_tua_stripe_secret_key
   ```
4. Inicia o servidor:
   ```bash
   npm start
   ```

### 3. Configurar o Frontend (Website)
1. Navega para a pasta `website/`:
   ```bash
   cd ../website
   ```
2. Instala as dependências:
   ```bash
   npm install
   ```
3. Inicia o servidor Next.js em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acede à plataforma em `http://localhost:3000`.

---

## 🔒 Segurança e Boas Práticas
- **Passwords Protegidas:** Armazenadas como hashes criptográficos via **bcrypt** na base de dados (com 10 rounds de salt).
- **Integridade da Base de Dados:** Implementação de chaves estrangeiras (`FK_itens_produto`, `FK_encomenda_utilizador`) e uso de transações SQL para garantir que as encomendas só são gravadas se o stock for atualizado corretamente.
- **Ambiente Isolado:** Nenhuma credencial privada ou chave de API está exposta no código fonte; todas são lidas de variáveis de ambiente.
