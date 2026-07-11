# PADRÕES.md — Padrões do Sistema CRM RTSC

## Objetivo

Este documento define os padrões permanentes de interface, experiência do usuário e tratamento de dados do CRM RTSC.

Todas as funcionalidades implementadas deverão seguir estas convenções, garantindo consistência visual, facilidade de uso e manutenção ao longo da evolução do sistema.

---

# 1. Padrões de Dados

Todos os campos deverão possuir máscaras, validações e comportamento padronizados.

| Campo | Padrão |
|-------|---------|
| CPF | `000.000.000-00` |
| CNPJ | `00.000.000/0000-00` |
| CEP | `00000-000` |
| Telefone | `(00) 0000-0000` |
| Celular / WhatsApp | `(00) 00000-0000` |
| Data | `dd/MM/yyyy` |
| Hora | `HH:mm` |
| Moeda | `R$ 0.000,00` |
| Percentual | `00,00%` |
| Consumo | `0 kWh` |
| Potência | `0,00 kWp` |
| Área | `0,00 m²` |

---

# 2. Formulários

Todos os formulários do sistema deverão seguir o mesmo padrão.

## Campos

Todo campo deve possuir:

- Label (obrigatório)
- Placeholder apenas como auxílio
- Máscara automática quando aplicável
- Validação em tempo real
- Mensagens de erro claras
- Destaque visual para campos obrigatórios
- Tooltip quando necessário
- Helper Text quando agregar valor

## Comportamento

- Aplicar máscara automaticamente durante a digitação.
- Permitir colar valores já formatados ou não formatados.
- Remover caracteres inválidos automaticamente.
- Exibir erro apenas quando necessário, evitando poluição visual.
- Destacar visualmente o campo inválido.

## Endereço

O CEP deverá:

- possuir máscara automática;
- permitir apenas CEP válido;
- buscar endereço automaticamente;
- preencher:
  - Rua
  - Bairro
  - Cidade
  - Estado

Sempre permitir edição manual caso necessário.

---

# 3. Datas e Horários

## Datas

Padrão obrigatório:

`dd/MM/yyyy`

Todos os campos de data deverão possuir:

- Date Picker (calendário)
- Digitação manual
- Validação automática
- Ícone de calendário

## Horários

Padrão obrigatório:

`HH:mm`

Todos os campos deverão possuir:

- Time Picker
- Digitação manual
- Validação

## Armazenamento

- Datas devem ser armazenadas em UTC.
- Exibir datas conforme o fuso configurado pela empresa.

---

# 4. Experiência do Usuário (UX)

Todo o CRM deverá seguir uma experiência consistente inspirada no Kommo.

## Prioridades

- Poucos cliques
- Interface limpa
- Alta velocidade
- Feedback imediato
- Navegação intuitiva

## Regras

Priorizar:

- Drawer em vez de abrir novas páginas
- Edição inline sempre que possível
- Autosave quando apropriado
- Componentes reutilizáveis
- Feedback visual imediato

## Carregamento

Sempre utilizar:

- Skeleton
- Loading discreto
- Indicadores de progresso quando necessário

Nunca bloquear a interface sem informar o usuário.

## Feedback

Utilizar Toast para:

- Sucesso
- Avisos
- Erros
- Informações

Confirmações somente para ações destrutivas.

---

# 5. Componentes

Antes de criar qualquer componente novo, verificar se já existe um componente reutilizável.

Padronizar obrigatoriamente:

- Button
- Input
- Textarea
- Select
- Combobox
- Checkbox
- Radio
- Switch
- Badge
- Card
- Table
- Drawer
- Dialog
- Sidebar
- Header
- Tabs
- Avatar
- Tooltip
- Dropdown
- Pagination

Evitar duplicações.

---

# 6. Tabelas

Todas as tabelas deverão possuir, quando aplicável:

- Busca
- Filtros
- Ordenação por colunas
- Paginação
- Estado vazio amigável
- Indicador de carregamento

Sempre priorizar leitura rápida.

---

# 7. Qualidade

Nenhuma Sprint será considerada concluída sem:

- Build aprovado
- Lint aprovado
- Testes aprovados
- Docker validado
- Integração Frontend ↔ Backend validada
- Documentação atualizada

Não utilizar:

- Dados mockados em funcionalidades concluídas
- Código temporário
- TODOs esquecidos
- Componentes duplicados
- Soluções improvisadas

---

# 8. Padrões Visuais

## Cores

Padronizar cores para:

- Sucesso
- Informação
- Atenção
- Erro
- Status neutros

Evitar utilizar cores diferentes para representar o mesmo significado em telas distintas.

## Ícones

Utilizar a mesma biblioteca de ícones em todo o sistema.

O mesmo conceito deve utilizar sempre o mesmo ícone.

---

# 9. Responsividade

O sistema deverá funcionar adequadamente em:

- Desktop
- Notebook
- Tablet
- Mobile

Priorizar a experiência Desktop, mantendo responsividade para os demais dispositivos.

---

# 10. Princípio Geral

Sempre priorizar:

- Consistência
- Simplicidade
- Reutilização
- Performance
- Escalabilidade
- Facilidade de manutenção

Quando existir mais de uma solução possível, optar pela que mantenha a experiência do usuário mais simples e consistente em todo o CRM.