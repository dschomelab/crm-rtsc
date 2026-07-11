# Arquitetura do Sistema

## Visão Geral

O CRM RTSC é uma aplicação web full-stack dividida em dois principais componentes: **backend** (API REST) e **frontend** (SPA React), ambos conteinerizados com Docker.

```
┌─────────────────────────────────────────────────────────────┐
│                       Cliente (Browser)                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Nginx (Port 80) - Frontend                     │
│              React + Vite + TanStack Router                 │
└──────────────────┬──────────────────────────────────────────┘
                   │ /api/*
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              NestJS API (Port 3001) - Backend               │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Auth    │ │ Pipeline │ │ Customer │ │      Lead     │  │
│  │ Module  │ │ Module   │ │ Module   │ │    Module     │  │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └──────┬────────┘  │
│       │           │            │               │           │
│  ┌────┴───────────┴────────────┴───────────────┴────┐      │
│  │              Prisma ORM / Service Layer            │      │
│  └────────────────────────┬──────────────────────────┘      │
└───────────────────────────┼──────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                PostgreSQL (Port 5432)                        │
│                  Banco de Dados Relacional                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend (NestJS)

### Estrutura de Módulos

O backend segue a arquitetura modular do NestJS com princípios de **Domain-Driven Design** e **Clean Architecture**.

```
src/
├── main.ts                  # Ponto de entrada
├── app.module.ts            # Módulo raiz
├── common/                  # Recursos compartilhados
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── dto/
├── modules/                 # Módulos de negócio
│   ├── auth/
│   ├── users/
│   ├── leads/
│   ├── customers/
│   ├── pipelines/
│   ├── proposals/
│   ├── activities/
│   └── settings/
└── prisma/                  # Prisma service
```

### Camadas por Módulo

Cada módulo segue a seguinte estrutura:

```
module/
├── module-name.module.ts    # Definição do módulo
├── module-name.controller.ts  # Rotas HTTP
├── module-name.service.ts   # Lógica de negócio
├── dto/                     # Data Transfer Objects
│   ├── create.dto.ts
│   ├── update.dto.ts
│   └── query.dto.ts
└── entities/                # Entidades / Tipos
    └── module-name.entity.ts
```

### Princípios

- **Injeção de Dependência**: Todos os serviços são injetados via construtor
- **Validação**: DTOs validados com `class-validator` + `class-transformer`
- **Serialização**: Uso de `ClassSerializerInterceptor` para transformar respostas
- **Versionamento**: API versionada via prefixo (`/api/v1`)

---

## Frontend (React + Vite)

### Estrutura

```
src/
├── main.tsx                 # Ponto de entrada
├── App.tsx                  # Componente raiz
├── routes/                  # Configuração de rotas (TanStack Router)
├── pages/                   # Páginas da aplicação
│   ├── dashboard/
│   ├── leads/
│   ├── customers/
│   ├── pipelines/
│   ├── proposals/
│   └── settings/
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes base (shadcn/ui)
│   └── shared/              # Componentes de negócio
├── hooks/                   # Custom hooks
├── services/                # Chamadas à API (axios/fetch)
├── stores/                  # Estado global (se aplicável)
├── types/                   # Tipos TypeScript
├── utils/                   # Funções utilitárias
└── lib/                     # Configurações de bibliotecas
```

### Stack

| Biblioteca         | Função                         |
|--------------------|--------------------------------|
| React 18           | Biblioteca de UI               |
| Vite 5             | Bundler / Dev Server           |
| TanStack Router    | Roteamento SPA                 |
| TanStack Query     | Server state / Cache           |
| TanStack Table     | Tabelas de dados               |
| React Hook Form    | Formulários                    |
| Zod                | Validação de schemas           |
| Tailwind CSS       | Estilização                    |
| shadcn/ui          | Componentes base               |
| Recharts           | Gráficos                       |
| Sonner             | Notificações toast             |
| lucide-react       | Ícones                         |

---

## Banco de Dados

### Diagrama Entidade-Relacionamento (Texto)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     User     │       │     Lead     │       │   Customer   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ assignedTo   │       │ id (PK)      │
│ email        │       │ id (PK)      │       │ name         │
│ password     │       │ name         │◄──────│ document     │
│ name         │       │ email        │       │ address      │
│ role         │       │ phone        │       │ city         │
│ isActive     │       │ source       │       │ state        │
│ refreshToken │       │ status       │       │ responsible──┼──►User
│ avatarUrl    │       │ notes        │       │ createdAt    │
│ phone        │       │ customerId───┼──►Customer          │
├──────────────┤       │ createdAt    │       └──────────────┘
│ createdAt    │       └──────────────┘              ▲
│ updatedAt    │              │                       │
└──────────────┘              │                       │
       │                      │                       │
       │              ┌───────┴───────┐               │
       │              │   Activity    │               │
       │              ├───────────────┤               │
       └──────────────┤ userId        │               │
                      │ leadId        │               │
                      │ customerId────┼───────────────┘
                      │ proposalId    │
                      │ type          │
                      │ description   │
                      │ dueDate       │
                      │ completedAt   │
                      └───────────────┘

┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   Pipeline   │       │  PipelineStage   │       │   Proposal   │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──────►│ id (PK)          │       │ id (PK)      │
│ name         │       │ name             │◄──────│ title        │
│ description  │       │ description      │       │ description  │
│ createdAt    │       │ order            │       │ value        │
└──────────────┘       │ type             │       │ status       │
                       │ probability      │       │ customerId───┼──►Customer
                       │ pipelineId (FK)  │       │ stageId──────┼──►PipelineStage
                       └──────────────────┘       │ createdAt    │
                                                   └──────────────┘

┌──────────────────┐
│ CompanySettings   │
├──────────────────┤
│ id ("default")   │
│ name             │
│ logoUrl          │
│ address          │
│ phone            │
│ email            │
│ website          │
│ document         │
└──────────────────┘
```

---

## Fluxo de Autenticação

O sistema utiliza **JWT + Refresh Token** para autenticação:

```
Cliente                    Backend                    Banco
   │                         │                         │
   │  POST /auth/login       │                         │
   │  {email, password}      │                         │
   │────────────────────────►│                         │
   │                         │  Valida credenciais     │
   │                         │  (bcrypt compare)       │
   │                         │────────────────────────►│
   │                         │◄────────────────────────│
   │                         │  Gera Access Token      │
   │                         │  (15 min) + Refresh     │
   │                         │  Token (7 dias)         │
   │◄────────────────────────│                         │
   │  {accessToken,          │                         │
   │   refreshToken}         │                         │
   │                         │                         │
   │  GET /api/v1/resource   │                         │
   │  Authorization: Bearer  │                         │
   │────────────────────────►│                         │
   │                         │  Valida JWT             │
   │                         │  (JwtGuard)             │
   │◄────────────────────────│                         │
   │                         │                         │
   │  POST /auth/refresh     │                         │
   │  {refreshToken}         │                         │
   │────────────────────────►│                         │
   │                         │  Verifica refresh no DB │
   │                         │  Gera novo par de tokens│
   │◄────────────────────────│                         │
```

### Guards e Estratégias

- **JwtAuthGuard**: Protege rotas autenticadas (valida Access Token)
- **RolesGuard**: Restringe acesso por perfil (Admin, Manager, Seller)
- **RefreshTokenStrategy**: Valida e renova Refresh Tokens

---

## Conveções de API

### Padrão de Rotas

```
GET    /api/v1/resource          # Listar (com paginação/filtros)
GET    /api/v1/resource/:id      # Obter por ID
POST   /api/v1/resource          # Criar
PATCH  /api/v1/resource/:id      # Atualizar parcialmente
DELETE /api/v1/resource/:id      # Remover (lógico ou físico)
```

### Padrão de Respostas

```json
// Sucesso
{
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 }
}

// Erro
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "email must be valid" }]
}
```

### Paginação

Todas as listas suportam `?page=1&limit=20&search=termo&sortBy=name&order=asc`.

---

## Tratamento de Erros

| Camada             | Estratégia                                     |
|--------------------|-------------------------------------------------|
| Validação DTO      | `ValidationPipe` global com mensagens amigáveis |
| Erros HTTP         | `HttpExceptionFilter` padroniza respostas       |
| Erros Prisma       | `PrismaClientExceptionFilter` trata erros de DB |
| Erros não capturados | `AllExceptionsFilter` fallback genérico       |
| Logging            | Logger do NestJS com níveis configuráveis       |

---

## Segurança

- **Senhas**: Hash com bcrypt (salt rounds = 10)
- **JWT**: Access Token curto (15 min) + Refresh Token (7 dias)
- **CORS**: Restrito a origens configuradas via `CORS_ORIGINS`
- **Headers**: Helmet para headers de segurança HTTP
- **Rate Limiting**: `@nestjs/throttler` para proteção contra brute-force
- **Validação**: Sanitização de inputs com `class-validator`
- **SQL Injection**: Prevenido pelo Prisma ORM (query parametrizada)
- **XSS**: Content Security Policy via Helmet
