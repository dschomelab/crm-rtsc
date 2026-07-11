# CRM RTSC

**Sistema de CRM para empresas de energia solar**

![Node](https://img.shields.io/badge/Node-20.x-339933?logo=node.js)
![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)

---

## Visão Geral da Arquitetura

```
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│               │        │               │        │               │
│   Frontend    │───────►│   Backend     │───────►│  PostgreSQL   │
│   React/Vite  │  HTTP  │   NestJS      │  Prisma │    Database   │
│   Port 80     │◄───────│   Port 3001   │◄───────│   Port 5432   │
│               │   API  │               │  Data  │               │
└───────────────┘        └───────────────┘        └───────────────┘
```

---

## Pré-requisitos

- **Docker** e **Docker Compose** (via Docker Desktop ou Docker Engine)
- **Node.js 20.x** (para desenvolvimento fora do Docker)
- **npm** (incluído com Node)

---

## Início Rápido (Docker)

```bash
# Clone o repositório
git clone <repo-url>
cd crm-rtsc

# Configure as variáveis de ambiente
cp backend/.env.example backend/.env

# Suba a aplicação
docker compose -f docker/docker-compose.yml up -d

# Acesse
# Frontend: http://localhost
# API:      http://localhost:3001/api/v1
```

---

## Setup Manual

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure o DATABASE_URL no .env para seu PostgreSQL local
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3001/api/v1" > .env
npm run dev
```

---

## Estrutura do Projeto

```
crm-rtsc/
├── backend/                    # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma       # Schema do banco de dados
│   │   └── seed.ts             # Dados iniciais
│   ├── src/
│   │   ├── main.ts             # Entry point
│   │   ├── app.module.ts       # Módulo raiz
│   │   ├── app.spec.ts         # Testes de infraestrutura
│   │   ├── common/             # Recursos compartilhados
│   │   │   ├── decorators/     # Decorators customizados
│   │   │   ├── filters/        # Exception filters globais
│   │   │   ├── guards/         # Guards (JWT, etc)
│   │   │   ├── interceptors/   # Interceptors (logging, transform)
│   │   │   └── pipes/          # Pipes de validação
│   │   ├── config/             # Configuração e schema de env
│   │   ├── auth/               # Módulo de autenticação (JWT + Refresh Token)
│   │   ├── database/           # Prisma service e módulo
│   │   ├── health/             # Health check endpoint
│   │   ├── users/              # Módulo de usuários
│   │   ├── pipelines/          # Módulo de pipelines (CRUD + estágios)
│   │   ├── leads/              # Módulo de leads (Kanban, filtros, busca)
│   │   └── activities/         # Módulo de atividades (timeline)
│   ├── test/                   # Testes e2e
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # SPA React
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Componente raiz
│   │   ├── app.test.ts         # Testes de infraestrutura
│   │   ├── styles/             # CSS (Tailwind + variáveis)
│   │   ├── routes/             # Configuração de rotas (TanStack Router)
│   │   ├── pages/              # Páginas (Dashboard, Pipeline, Login, 404)
│   │   ├── components/         # Componentes
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── layout/         # Layout (Sidebar, Header, AppLayout)
│   │   │   ├── pipeline/       # Kanban (Board, Column, Card, Drawer, Timeline)
│   │   │   └── shared/         # Shared (Loading, Error)
│   │   ├── hooks/              # Custom hooks (useAuth, useTheme, usePipeline, useLeads)
│   │   ├── services/           # API client e serviços (api, auth, pipeline, lead, activity)
│   │   ├── lib/                # Utilitários
│   │   └── types/              # Tipos TypeScript
│   ├── Dockerfile
│   ├── nginx.conf              # Config Nginx para SPA
│   └── package.json
├── docker/
│   └── docker-compose.yml      # Orquestração de containers
├── docs/
│   ├── ARCHITECTURE.md         # Documentação da arquitetura
│   ├── SETUP.md                # Guia de setup detalhado
│   └── ENV_VARS.md             # Variáveis de ambiente
├── .github/workflows/
│   └── ci.yml                  # Pipeline CI/CD
├── .editorconfig
├── .prettierrc
├── .lintstagedrc.json
├── commitlint.config.js
└── .gitignore
```

---

## Variáveis de Ambiente

### Backend

| Variável              | Descrição                    | Padrão                                     |
|-----------------------|------------------------------|--------------------------------------------|
| `DATABASE_URL`        | URL do PostgreSQL            | `postgresql://user:pass@localhost:5432/crm_db` |
| `JWT_SECRET`          | Chave secreta JWT            | -                                          |
| `JWT_REFRESH_SECRET`  | Chave secreta refresh token  | -                                          |
| `CORS_ORIGINS`        | Origens CORS permitidas      | `http://localhost:5173`                    |

### Frontend

| Variável       | Descrição              | Padrão                               |
|----------------|------------------------|--------------------------------------|
| `VITE_API_URL` | URL base da API        | `http://localhost:3001/api/v1`       |

Consulte [docs/ENV_VARS.md](docs/ENV_VARS.md) para a lista completa.

---

## Scripts Disponíveis

### Backend

| Script               | Comando                   |
|----------------------|---------------------------|
| `npm run start:dev`  | Iniciar em dev (hot reload) |
| `npm run build`      | Compilar para produção    |
| `npm run test`       | Rodar testes unitários    |
| `npm run lint`       | Verificar código          |
| `npm run format`     | Formatador (Prettier)     |

### Frontend

| Script           | Comando                   |
|------------------|---------------------------|
| `npm run dev`    | Iniciar dev server (Vite) |
| `npm run build`  | Build de produção         |
| `npm run test`   | Rodar testes (Vitest)     |
| `npm run lint`   | Verificar código          |
| `npm run format` | Formatador (Prettier)     |

---

## Comandos Úteis

```bash
# Prisma - Gerar cliente
npx prisma generate

# Prisma - Criar migration
npx prisma migrate dev --name descricao

# Prisma - Aplicar migrations em produção
npx prisma migrate deploy

# Prisma - Abrir Studio (http://localhost:5555)
npx prisma studio

# Docker - Ver logs do backend
docker compose -f docker/docker-compose.yml logs -f backend

# Docker - Reconstruir container
docker compose -f docker/docker-compose.yml up -d --build
```

---

## Guia do Desenvolvedor

### Convenção de Commits

Este projeto utiliza **Conventional Commits**:

```
<type>(<scope>): <description>

tipos: feat, fix, chore, docs, style, refactor, test, ci
scope: backend, frontend, docker, docs
```

Exemplos:
```
feat(backend): add lead creation endpoint
fix(frontend): correct form validation
docs: update setup guide
```

### Husky + Lint-Staged

Antes de cada commit:

1. **Pre-commit**: `lint-staged` roda ESLint e Prettier nos arquivos modificados
2. **Commit-msg**: `commitlint` valida o formato da mensagem

---

## Licença

Este projeto é proprietário. Todos os direitos reservados.
