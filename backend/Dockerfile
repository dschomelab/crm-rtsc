FROM node:20-alpine AS builder

WORKDIR /app

# OpenSSL necessário para Prisma detectar a plataforma correta
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./

RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src/

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# OpenSSL necessário para Prisma no Alpine
RUN apk add --no-cache openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY package.json ./

# Permite que o usuário nestjs execute prisma migrate/seed no startup
RUN chown -R nestjs:nodejs /app/node_modules/@prisma/engines /app/node_modules/.prisma /app/prisma

RUN mkdir -p /app/uploads && chown nestjs:nodejs /app/uploads

USER nestjs

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/src/main"]
