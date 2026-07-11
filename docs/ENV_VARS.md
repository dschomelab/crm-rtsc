# Variáveis de Ambiente

## Backend (`backend/.env`)

| Variável              | Descrição                       | Padrão                                      | Obrigatório |
|-----------------------|---------------------------------|---------------------------------------------|-------------|
| `NODE_ENV`            | Ambiente de execução            | `development`                               | Não         |
| `PORT`                | Porta do servidor               | `3001`                                      | Não         |
| `DATABASE_URL`        | URL de conexão com PostgreSQL   | `postgresql://user:pass@localhost:5432/crm_db` | Sim      |
| `JWT_SECRET`          | Chave secreta para JWT          | -                                           | Sim         |
| `JWT_EXPIRES_IN`      | Tempo de expiração do JWT       | `15m`                                       | Não         |
| `JWT_REFRESH_SECRET`  | Chave secreta para refresh token| -                                           | Sim         |
| `JWT_REFRESH_EXPIRES_IN` | Expiração do refresh token   | `7d`                                        | Não         |
| `API_PREFIX`          | Prefixo das rotas da API        | `api/v1`                                    | Não         |
| `CORS_ORIGINS`        | Origens permitidas para CORS    | `http://localhost:5173`                     | Sim         |

### Exemplo `backend/.env`

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://crm_user:crm_password@localhost:5432/crm_db?schema=public
JWT_SECRET=my-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=my-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
API_PREFIX=api/v1
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Frontend (`frontend/.env`)

| Variável       | Descrição              | Padrão                               | Obrigatório |
|----------------|------------------------|--------------------------------------|-------------|
| `VITE_API_URL` | URL base da API NestJS | `http://localhost:3001/api/v1`       | Sim         |

### Exemplo `frontend/.env`

```env
VITE_API_URL=http://localhost:3001/api/v1
```

---

## Docker Compose (`docker/docker-compose.yml`)

As variáveis do backend são injetadas diretamente no `docker-compose.yml`. Consulte o arquivo para ver a configuração completa.

### Notas

- Variáveis com `VITE_` prefixo são expostas ao cliente (frontend). **Nunca** coloque secrets nelas.
- Em produção, todas as secrets devem ser gerenciadas via **Docker Secrets**, **AWS Secrets Manager**, **Hashicorp Vault** ou ferramenta similar.
- O `JWT_SECRET` e `JWT_REFRESH_SECRET` devem ser strings longas e aleatórias em produção.
- Altere as senhas padrão do banco (`crm_user` / `crm_password`) em ambientes reais.
