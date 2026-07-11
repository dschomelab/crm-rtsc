# Guia de Setup

## Pré-requisitos

- **Docker** e **Docker Compose** (recomendado)
- **Node.js 20.x** (para desenvolvimento local)
- **npm** (gerenciador de pacotes)
- **PostgreSQL 16** (para desenvolvimento local sem Docker)

---

## Setup com Docker (Recomendado)

### 1. Clone o repositório

```bash
git clone <repo-url>
cd crm-rtsc
```

### 2. Configure as variáveis de ambiente

```bash
cp backend/.env.example backend/.env
# Edite backend/.env conforme necessário
```

### 3. Suba os containers

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 4. Verifique se tudo está rodando

```bash
docker compose -f docker/docker-compose.yml ps
```

### 5. Acesse a aplicação

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001/api/v1
- **Banco de Dados**: localhost:5432

### Comandos úteis do Docker

```bash
# Ver logs
docker compose -f docker/docker-compose.yml logs -f backend

# Reconstruir e subir
docker compose -f docker/docker-compose.yml up -d --build

# Parar containers
docker compose -f docker/docker-compose.yml down

# Parar e remover volumes
docker compose -f docker/docker-compose.yml down -v

# Executar comando no container
docker exec -it crm-backend sh
```

---

## Setup Manual (Desenvolvimento Local)

### Backend

#### 1. Instale as dependências

```bash
cd backend
npm install
```

#### 2. Configure o ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as configurações do seu banco local:

```env
DATABASE_URL=postgresql://crm_user:crm_password@localhost:5432/crm_db?schema=public
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=sua-chave-refresh
JWT_REFRESH_EXPIRES_IN=7d
API_PREFIX=api/v1
CORS_ORIGINS=http://localhost:5173
```

#### 3. Configure o banco de dados

Certifique-se de que o PostgreSQL está rodando. Crie o banco:

```bash
psql -U postgres
CREATE DATABASE crm_db;
CREATE USER crm_user WITH PASSWORD 'crm_password';
GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;
\q
```

#### 4. Execute as migrações

```bash
npx prisma migrate dev
```

#### 5. Popule o banco com dados iniciais

```bash
npx prisma db seed
```

#### 6. Inicie o servidor

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run build && npm run start:prod
```

O servidor estará disponível em **http://localhost:3001**.

### Frontend

#### 1. Instale as dependências

```bash
cd frontend
npm install
```

#### 2. Configure o ambiente

Crie o arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

#### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em **http://localhost:5173**.

---

## Configuração do Banco de Dados

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome-da-migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (cuidado: apaga dados)
npx prisma migrate reset
```

### Prisma Studio

```bash
npx prisma studio
```

Acesse o Prisma Studio em http://localhost:5555 para visualizar e editar dados.

### Seeds

O seed atual cria:

- **1 usuário administrador** (admin@crm.com / Admin123!)
- **2 pipelines** (Vendas Diretas com 6 estágios, Pós-Vendas com 5 estágios)
- **7 leads de exemplo** distribuídos nos estágios do pipeline Vendas Diretas
- **Configurações da empresa** padrão

---

## Criando um Usuário Admin

Após rodar o seed, você pode fazer login com:

| Campo    | Valor                |
|----------|----------------------|
| Email    | admin@crm.com        |
| Senha    | Admin@123            |

Para criar manualmente, use o endpoint:

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"Admin@123","name":"Admin","role":"ADMIN"}'
```

---

## Variáveis de Ambiente

Consulte [docs/ENV_VARS.md](ENV_VARS.md) para a lista completa de variáveis de ambiente.
