# Idioma

Toda comunicação com o usuário deve ser realizada exclusivamente em português (pt-BR).

Isso inclui:

- relatórios finais;
- planejamento;
- mensagens de progresso;
- documentação gerada para o projeto;
- comentários quando destinados ao usuário.

Exceções:

- código;
- nomes de classes, funções, arquivos e variáveis;
- mensagens de erro provenientes de ferramentas externas;
- documentação oficial de terceiros quando citada literalmente.

# Comandos Úteis

```bash
# Docker: buildar e subir tudo
docker compose -f docker/docker-compose.yml up -d --build

# Docker: logs do backend
docker compose -f docker/docker-compose.yml logs -f backend

# Backend: lint + build + test (via D: drive)
cd D:\crm-rtsc-build\backend && npm run lint && npm run build && npm test

# Frontend: lint + build + test (via D: drive)
cd D:\crm-rtsc-build\frontend && npm run lint && npm run build && npm test

# Sincronizar WSL → D:
robocopy "\\wsl.localhost\Ubuntu-24.04\home\diego\workspace\crm-rtsc" "D:\crm-rtsc-build" /E /R:1 /W:1 /NP /NFL /NDL /XD node_modules dist .git coverage

# Sincronizar D: → WSL
robocopy "D:\crm-rtsc-build" "\\wsl.localhost\Ubuntu-24.04\home\diego\workspace\crm-rtsc" /E /R:1 /W:1 /NP /NFL /NDL /XD node_modules dist .git coverage
```