# Arquitetura do Sistema - Plataforma de Acolhimento Social

## 1. Visão Geral

A Plataforma de Acolhimento Social é um sistema web desenvolvido para apoiar a gestão institucional do Lar Batista Albertine Meador, centralizando informações públicas, doações, transparência, governança, banco de currículos, notícias, vagas, projetos sociais e funcionalidades administrativas.

O sistema foi desenvolvido com arquitetura web em camadas, separando frontend, backend, banco de dados e serviços externos. Essa separação facilita manutenção, evolução, hospedagem e segurança.

A solução possui duas áreas principais:

1. Área pública, acessível a visitantes, doadores, voluntários e interessados.
2. Área administrativa, protegida por autenticação, destinada à equipe interna da instituição.

---

## 2. Objetivo da Arquitetura

A arquitetura tem como objetivo organizar o sistema de forma escalável, segura e de fácil manutenção, permitindo:

* Separação clara entre interface, regras de negócio e banco de dados.
* Consumo de API REST pelo frontend.
* Controle de autenticação para administradores e doadores.
* Armazenamento de dados em banco na nuvem.
* Envio de e-mails de recuperação de senha.
* Possibilidade de hospedagem separada para frontend e backend.
* Facilidade para futuras melhorias e integrações.

---

## 3. Visão Geral da Solução

O fluxo principal da aplicação pode ser representado da seguinte forma:

```txt
Usuário / Administrador / Doador
        ↓
Frontend React + Vite
        ↓
API REST Node.js + Express
        ↓
MongoDB Atlas
        ↓
Serviços externos
E-mail SMTP / Gmail / Nodemailer
```

O frontend é responsável pela interface visual e pela experiência do usuário.
O backend concentra as regras de negócio, autenticação, validações e comunicação com o banco.
O MongoDB Atlas armazena os dados principais da aplicação.
O serviço de e-mail é utilizado para recuperação de senha e notificações administrativas.

---

## 4. Tecnologias Utilizadas

### 4.1 Frontend

* React
* Vite
* React Router DOM
* JavaScript
* CSS
* Fetch API para consumo da API
* LocalStorage para persistências auxiliares e compatibilidade com telas antigas

### 4.2 Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT para autenticação
* bcryptjs para criptografia de senhas
* Nodemailer para envio de e-mails
* dotenv para variáveis de ambiente
* CORS para controle de comunicação entre frontend e backend

### 4.3 Banco de Dados

* MongoDB Atlas
* Collections organizadas por domínio do sistema
* Usuários de banco com credenciais próprias para conexão via backend

### 4.4 Serviços Externos

* Gmail SMTP para envio de e-mails
* Senha de app para autenticação segura no envio de mensagens
* MongoDB Atlas como banco de dados em nuvem

---

## 5. Estrutura Geral do Projeto

A estrutura geral do projeto segue a organização abaixo:

```txt
plataforma-acolhimento-social
│
├── docs
│   ├── arquitetura
│   │   └── ARQUITETURA.md
│   ├── deploy
│   │   └── GUIA_DEPLOY.md
│   ├── manual-desenvolvedor
│   ├── manual-usuario
│   └── seguranca
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   │   ├── admin
│   │   │   └── public
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── backend
│       └── backend
│           ├── src
│           │   ├── controllers
│           │   ├── models
│           │   ├── routes
│           │   ├── services
│           │   └── server.js
│           ├── .env
│           └── package.json
│
├── README.md
└── .gitignore
```

Observação: a localização atual do backend está dentro da pasta `frontend/backend/backend`. Em uma evolução futura, recomenda-se separar o backend em uma pasta própria na raiz do projeto, por exemplo:

```txt
plataforma-acolhimento-social
├── frontend
├── backend
└── docs
```

Essa reorganização facilitaria a hospedagem, manutenção e entendimento do projeto.

---

## 6. Arquitetura em Camadas

O sistema está dividido em quatro camadas principais.

### 6.1 Camada de Apresentação

A camada de apresentação é composta pelo frontend em React. Ela contém as páginas públicas, páginas administrativas e telas de autenticação.

Responsabilidades:

* Exibir páginas institucionais.
* Exibir formulários de cadastro, login e recuperação de senha.
* Consumir a API REST do backend.
* Controlar navegação entre páginas.
* Exibir mensagens de erro e sucesso.
* Adaptar a interface para desktop e dispositivos móveis.

Principais áreas:

```txt
src/pages/public
src/pages/admin
src/components
src/services
src/utils
```

### 6.2 Camada de Serviços do Frontend

A camada de serviços do frontend centraliza as chamadas para o backend.

Exemplo:

```txt
src/services/api.js
src/services/doadorAuthService.js
src/services/governancaService.js
src/services/auditoriaService.js
```

O arquivo `api.js` define funções genéricas como:

```txt
apiGet
apiPost
apiPut
apiDelete
```

Essas funções são usadas pelos serviços específicos para comunicação com a API.

### 6.3 Camada de API / Backend

O backend foi desenvolvido com Node.js e Express.

Responsabilidades:

* Receber requisições HTTP.
* Validar dados recebidos.
* Aplicar regras de negócio.
* Realizar autenticação.
* Criptografar senhas.
* Gerar tokens JWT.
* Acessar o MongoDB.
* Enviar e-mails de recuperação de senha.
* Retornar respostas padronizadas ao frontend.

Principais diretórios:

```txt
src/controllers
src/models
src/routes
src/services
```

### 6.4 Camada de Dados

A camada de dados utiliza MongoDB Atlas com Mongoose.

Responsabilidades:

* Persistir dados de doadores.
* Persistir dados administrativos.
* Persistir tokens/códigos de recuperação de senha.
* Armazenar informações institucionais e operacionais.
* Permitir consultas, cadastros, edições e exclusões controladas pela API.

---

## 7. Frontend

O frontend é a interface principal da aplicação. Ele foi desenvolvido com React e Vite, permitindo carregamento rápido e desenvolvimento modular.

### 7.1 Páginas Públicas

As páginas públicas são acessíveis sem login.

Principais páginas:

```txt
Home
Quem Somos
Projetos
Transparência
Governança Institucional
Notícias
Detalhe da Notícia
Vagas
Doar Agora
Área do Doador
Painel do Doador Público
Enviar Currículo
Parceiros
```

Essas páginas têm como objetivo apresentar a instituição, divulgar informações públicas, permitir contato com doadores e voluntários e oferecer serviços institucionais.

### 7.2 Páginas Administrativas

As páginas administrativas são destinadas à equipe interna da instituição.

Principais páginas:

```txt
Dashboard Admin
Parceiros Admin
Notícias Admin
Vagas Admin
Prestação de Contas Admin
Relatórios Admin
Pendentes Admin
Banco de Currículos Admin
Governança Admin
Gráficos Admin
Histórico de Necessidades Admin
```

Essas telas devem ser protegidas por autenticação e acessíveis apenas a usuários autorizados.

---

## 8. Backend

O backend atua como intermediário entre o frontend e o banco de dados.

### 8.1 Responsabilidades Principais

* Cadastro de doadores.
* Login de doadores.
* Recuperação de senha de doadores por código.
* Login administrativo.
* Solicitação de recuperação de senha administrativa.
* Gestão de dados institucionais.
* Comunicação com o MongoDB Atlas.
* Envio de e-mails via Nodemailer.

### 8.2 Controllers

Os controllers recebem as requisições e executam as regras de negócio.

Exemplos:

```txt
authController.js
doadorAuthController.js
```

### 8.3 Services

Os services concentram integrações e funções auxiliares.

Exemplo:

```txt
emailService.js
```

Esse serviço é responsável por configurar o transporte de e-mail e enviar mensagens de recuperação de senha.

### 8.4 Models

Os models representam as collections do MongoDB.

Exemplos:

```txt
Doador.js
PasswordResetToken.js
```

---

## 9. Autenticação e Segurança

### 9.1 Login do Doador

O doador realiza login utilizando e-mail e senha. A senha é validada no backend com comparação segura usando bcrypt.

Fluxo:

```txt
Doador informa e-mail e senha
        ↓
Frontend envia dados para API
        ↓
Backend busca doador no MongoDB
        ↓
Backend compara senha com bcrypt
        ↓
Backend gera token JWT
        ↓
Frontend armazena token e redireciona para painel
```

### 9.2 Cadastro do Doador

O cadastro do doador coleta informações como:

```txt
Nome ou razão social
Tipo de pessoa
CPF ou CNPJ
Telefone
E-mail
Senha
País
Estado
Município
Aceite LGPD
```

A senha é criptografada antes de ser salva no banco.

### 9.3 Recuperação de Senha do Doador

A recuperação de senha do doador utiliza código de 6 dígitos enviado por e-mail.

Fluxo:

```txt
Doador informa e-mail cadastrado
        ↓
Backend verifica se o e-mail existe
        ↓
Backend gera código de 6 dígitos
        ↓
Backend salva o código no MongoDB com expiração
        ↓
Backend envia o código por e-mail
        ↓
Doador informa código e nova senha
        ↓
Backend valida código
        ↓
Backend criptografa e salva nova senha
```

O código possui validade limitada, reduzindo risco de uso indevido.

### 9.4 Recuperação Administrativa

Para o painel administrativo, a recuperação de senha não deve redefinir automaticamente a senha do administrador.

O fluxo administrativo envia uma solicitação para o e-mail técnico configurado no backend. A equipe responsável deve validar a solicitação e realizar o reset de forma controlada.

### 9.5 Criptografia de Senhas

As senhas são criptografadas com bcrypt antes de serem armazenadas.

O sistema não deve armazenar senhas em texto puro.

### 9.6 Tokens JWT

O JWT é utilizado para autenticação de sessões, especialmente em áreas protegidas.

O token deve possuir tempo de expiração e ser validado pelo backend nas rotas protegidas.

---

## 10. Banco de Dados

O banco de dados utilizado é o MongoDB Atlas.

### 10.1 Collections Principais

As principais collections previstas no sistema são:

```txt
doadores
passwordresettokens
administradores
noticias
vagas
governanca
prestacaocontas
curriculos
doacoes
necessidades
parceiros
```

A nomenclatura real pode variar conforme os models existentes no projeto.

### 10.2 Doador

Armazena dados dos doadores cadastrados.

Campos esperados:

```txt
nome
email
senha
telefone
documento
tipoPessoa
pais
estado
municipio
createdAt
updatedAt
```

### 10.3 PasswordResetToken

Armazena códigos ou tokens de recuperação de senha.

Campos esperados:

```txt
email
token
tipoUsuario
usado
expiraEm
createdAt
updatedAt
```

No fluxo atual do doador, o campo `token` pode armazenar o código de 6 dígitos.

---

## 11. Envio de E-mails

O envio de e-mails é feito com Nodemailer usando SMTP.

Variáveis principais:

```env
EMAIL_MODO_SIMULADO=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=email_de_envio
EMAIL_PASS=senha_de_app
EMAIL_FROM="Lar Batista Albertine Meador <email_de_envio>"
EMAIL_REPLY_TO=adm@larbatista.org.br
EMAIL_ADMIN_RECUPERACAO=adm@larbatista.org.br
```

### 11.1 E-mail de Recuperação do Doador

O sistema envia um código de recuperação para o e-mail cadastrado do doador.

### 11.2 E-mail de Solicitação Administrativa

O sistema envia uma notificação para o e-mail administrativo quando há solicitação de recuperação de senha administrativa.

### 11.3 Modo Simulado

O modo simulado pode ser usado em desenvolvimento para testar a recuperação sem envio real de e-mail.

```env
EMAIL_MODO_SIMULADO=true
```

Em produção, deve ser usado:

```env
EMAIL_MODO_SIMULADO=false
```

---

## 12. Variáveis de Ambiente

As variáveis de ambiente devem ficar em arquivo `.env`, que não deve ser enviado para o GitHub.

Exemplo de variáveis:

```env
PORT=3333
JWT_SECRET=chave_secreta_segura
MONGO_URI=string_de_conexao_mongodb
EMAIL_MODO_SIMULADO=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=email_de_envio
EMAIL_PASS=senha_de_app
EMAIL_FROM="Nome do Sistema <email_de_envio>"
EMAIL_REPLY_TO=email_institucional
EMAIL_ADMIN_RECUPERACAO=email_tecnico
FRONTEND_URL=http://localhost:5173
```

Em produção, `FRONTEND_URL` deve ser substituída pela URL real do site.

Exemplo:

```env
FRONTEND_URL=https://seudominio.com.br
```

O frontend também deve possuir a URL da API configurada:

```env
VITE_API_URL=https://url-da-api.com/api
```

---

## 13. Comunicação Frontend e Backend

O frontend utiliza a Fetch API para enviar requisições HTTP ao backend.

Exemplo de fluxo:

```txt
Doador clica em "Esqueci minha senha"
        ↓
DoadorLogin.jsx chama doadorAuthService.js
        ↓
doadorAuthService.js chama api.js
        ↓
api.js envia POST para /api/doador-auth/solicitar-recuperacao
        ↓
Backend processa solicitação
        ↓
Backend envia e-mail
        ↓
Frontend exibe mensagem de sucesso
```

---

## 14. Rotas Principais

### 14.1 Rotas Públicas do Frontend

```txt
/
 /quem-somos
 /projetos
 /transparencia
 /governanca
 /noticias
 /noticias/:id
 /vagas
 /doar-agora
 /doador/login
 /doador/painel
 /enviar-curriculo
```

### 14.2 Rotas Administrativas do Frontend

```txt
/admin/login
/admin/dashboard
/admin/noticias
/admin/vagas
/admin/prestacao-contas
/admin/relatorios
/admin/pendentes
/admin/banco-curriculos
/admin/governanca
```

### 14.3 Rotas de API

Exemplos de rotas de autenticação:

```txt
POST /api/doador-auth/registrar
POST /api/doador-auth/login
POST /api/doador-auth/solicitar-recuperacao
POST /api/doador-auth/redefinir-senha
```

As rotas reais podem variar conforme a organização dos arquivos de rotas.

---

## 15. Hospedagem

A arquitetura permite hospedar frontend e backend separadamente.

### 15.1 Ambiente Local

```txt
Frontend: http://localhost:5173
Backend: http://localhost:3333/api
Banco: MongoDB Atlas
```

### 15.2 Ambiente de Produção

```txt
Frontend: https://seudominio.com.br
Backend: https://api.seudominio.com.br/api
Banco: MongoDB Atlas
```

### 15.3 Hospedagem do Frontend

O frontend pode ser hospedado em plataformas como:

```txt
Vercel
Netlify
Render Static Site
Hospedagem própria
```

Antes da hospedagem, deve ser executado:

```bash
npm run build
```

### 15.4 Hospedagem do Backend

O backend pode ser hospedado em plataformas como:

```txt
Render
Railway
Fly.io
VPS
Hospedagem Node.js
```

O backend precisa receber as variáveis de ambiente de produção na plataforma de hospedagem.

---

## 16. CORS

O backend deve permitir requisições do domínio do frontend.

Em desenvolvimento:

```txt
http://localhost:5173
```

Em produção:

```txt
https://seudominio.com.br
```

Uma configuração incorreta de CORS pode impedir que o frontend acesse a API.

---

## 17. Segurança e LGPD

O sistema lida com dados pessoais de doadores, voluntários e candidatos. Por isso, deve observar boas práticas de segurança e privacidade.

Medidas aplicadas ou recomendadas:

* Criptografia de senhas com bcrypt.
* Uso de JWT para autenticação.
* Validação de dados no frontend e backend.
* Aceite LGPD no cadastro.
* Proteção de rotas administrativas.
* Não envio do arquivo `.env` ao GitHub.
* Não exposição de senhas no código.
* Uso de senha de app para e-mail.
* Controle de acesso ao MongoDB Atlas.
* Troca de credenciais antes da entrega definitiva.
* Backup periódico do banco de dados.

---

## 18. Backup e Manutenção

Recomendações de backup:

* Realizar backup semanal do MongoDB Atlas.
* Exportar dados sensíveis antes de grandes alterações.
* Manter histórico de commits no GitHub.
* Documentar alterações importantes no projeto.
* Trocar senhas após entrega para a instituição.
* Remover acessos pessoais do desenvolvedor após transferência.

---

## 19. Entrega para a Instituição

Antes da entrega final, recomenda-se preparar um documento seguro contendo:

```txt
URL do site
URL da API
Login administrativo
E-mail de suporte
Orientações para troca de senha
Dados do MongoDB Atlas
Variáveis de ambiente de produção
Procedimento de backup
Contato técnico
```

Esse documento deve ser entregue de forma protegida, preferencialmente por PDF com senha ou por gerenciador de senhas.

A senha do PDF não deve ser enviada no mesmo canal do arquivo.

---

## 20. Pontos de Atenção

Antes da publicação do sistema, verificar:

* Se o backend está sem erro.
* Se o frontend executa `npm run build` sem falhas.
* Se as rotas públicas funcionam.
* Se as rotas administrativas exigem login.
* Se o cadastro de doador funciona.
* Se a recuperação de senha envia código corretamente.
* Se o login com nova senha funciona.
* Se o `.env` está no `.gitignore`.
* Se não há senhas expostas no GitHub.
* Se o MongoDB Atlas está com acesso restrito.
* Se o domínio final foi configurado no backend.
* Se o CORS permite apenas domínios autorizados.

---

## 21. Melhorias Futuras

Possíveis melhorias para versões futuras:

* Separar definitivamente frontend e backend em pastas independentes.
* Implementar autenticação em dois fatores para administradores.
* Criar perfis de acesso administrativo por permissões.
* Adicionar painel de auditoria.
* Registrar logs de ações administrativas.
* Criar rotina automática de backup.
* Melhorar upload e gestão de documentos.
* Criar dashboard com indicadores sociais.
* Criar integração com serviço profissional de e-mail.
* Criar ambiente separado para homologação e produção.
* Implementar testes automatizados.
* Melhorar acessibilidade digital conforme WCAG.
* Criar documentação técnica da API com Swagger ou similar.

---

## 22. Conclusão

A arquitetura da Plataforma de Acolhimento Social foi estruturada para permitir evolução gradual, separando interface, API, banco de dados e serviços externos.

O sistema atende às principais necessidades institucionais de divulgação, transparência, cadastro de doadores, recuperação de senha, painel administrativo e gestão de informações.

Com os ajustes de hospedagem, segurança, documentação e transferência de acessos, a plataforma poderá ser disponibilizada em ambiente público, mantendo o painel administrativo protegido e os dados armazenados em banco de dados na nuvem.
