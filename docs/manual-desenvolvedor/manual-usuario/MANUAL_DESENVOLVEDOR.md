# MANUAL DO DESENVOLVEDOR

## Plataforma de Acolhimento Social

### Versão

1.0

---

# 1. Visão Geral

A Plataforma de Acolhimento Social foi desenvolvida para apoiar instituições do terceiro setor através de uma solução web moderna, segura e escalável.

---

# 2. Arquitetura

Fluxo da aplicação:

Usuário

↓

Frontend React + Vite

↓

API REST Node.js + Express

↓

MongoDB Atlas

---

# 3. Frontend

Tecnologias:

* React
* Vite
* JavaScript
* React Router
* Swiper

Estrutura principal:

frontend/src/

* assets
* components
* pages
* services
* routes
* utils

---

# 4. Backend

Tecnologias:

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcryptjs

Estrutura principal:

backend/src/

* controllers
* models
* routes
* middlewares

---

# 5. Segurança

Implementações:

* bcrypt para criptografia de senhas.
* JWT para autenticação.
* Rotas protegidas.
* Controle de sessão.
* Logout seguro.
* Senha forte.

---

# 6. Banco de Dados

Banco utilizado:

MongoDB Atlas

Coleções previstas:

* admins
* doadores
* parceiros
* noticias
* necessidades
* curriculos
* vagas

---

# 7. Variáveis de Ambiente

Frontend:

```env
VITE_API_URL=
```

Backend:

```env
PORT=
MONGO_URI=
JWT_SECRET=
```

Nunca armazenar valores reais em repositórios públicos.

---

# 8. Build

Frontend:

```bash
npm run build
```

Saída:

```txt
frontend/dist
```

---

# 9. Deploy

Frontend:

Vercel

Backend:

Render

Banco:

MongoDB Atlas

---

# 10. Boas Práticas

* Não commitar arquivos .env
* Não armazenar senhas no código
* Validar entradas do usuário
* Atualizar dependências periodicamente
* Testar build antes de publicar

---

# 11. Manutenção

Recomenda-se:

* Backup semanal
* Revisão de logs
* Monitoramento de erros
* Atualização periódica de dependências
