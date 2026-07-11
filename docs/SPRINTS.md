# SPRINTS.md

# Sprint 0 — Arquitetura

## Objetivo

Definir toda a estrutura do projeto antes do início do desenvolvimento.

Nenhuma funcionalidade deverá ser implementada nesta sprint. O objetivo é eliminar dúvidas arquiteturais e criar uma base sólida para evolução do CRM.

---

## Escopo

Definir completamente:

- visão do produto;
- público-alvo;
- diferenciais do CRM;
- arquitetura geral;
- stack tecnológica;
- organização do repositório;
- estrutura de módulos;
- entidades principais;
- autenticação;
- permissões;
- estratégia de documentação;
- estratégia de desenvolvimento;
- roadmap completo;
- backlog inicial.

Toda decisão arquitetural deverá ser registrada na documentação.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- toda a arquitetura estiver definida;
- não existirem dúvidas estruturais antes do início da implementação;
- toda a documentação inicial estiver criada.

---

# Sprint 1 — Foundation

## Objetivo

Construir toda a fundação técnica do projeto.

Ao final desta sprint deverá existir uma aplicação totalmente funcional, porém sem regras de negócio do CRM.

---

## Escopo

Implementar:

- estrutura completa do projeto;
- autenticação base;
- layout principal;
- navegação;
- infraestrutura Docker;
- banco de dados;
- migrations;
- documentação;
- testes;
- integração Frontend ↔ Backend;
- componentes reutilizáveis;
- sistema de temas.

Nenhuma funcionalidade comercial deverá ser implementada.

O foco desta sprint é preparar o terreno para todas as próximas etapas.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- aplicação iniciar corretamente;
- frontend e backend comunicarem entre si;
- Docker funcionar integralmente;
- autenticação estiver operacional;
- build, lint e testes forem aprovados.

---

# Sprint 2 — Autenticação

## Objetivo

Concluir toda a experiência de autenticação do usuário.

O sistema deverá estar preparado para trabalhar com usuários, sessões e permissões desde o início, criando uma base sólida para o módulo de Administração do Sistema.

---

## Escopo

Implementar:

- login;
- logout;
- refresh token;
- usuário administrador;
- proteção das rotas;
- persistência da sessão;
- tratamento de sessões expiradas;
- redirecionamentos automáticos;
- recuperação adequada de erros de autenticação.

Preparar a estrutura para integração futura com o módulo de Administração.

### Usuários

Preparar autenticação baseada em usuários cadastrados.

Cada usuário deverá possuir identidade única e estar preparado para receber:

- equipe;
- perfil de acesso;
- permissões;
- status (ativo/inativo).

Nesta sprint ainda não será implementado o gerenciamento de usuários.

---

### Perfis de acesso

Preparar toda a autenticação para trabalhar futuramente com:

- Administrador;
- Gestor;
- Comercial;
- Instalador;
- Financeiro;
- demais perfis cadastrados.

A estrutura deverá permitir expansão sem necessidade de refatoração.

---

### Sessões

Preparar suporte para:

- bloqueio de usuários;
- redefinição de senha;
- tempo de expiração de sessão;
- renovação automática de sessão.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- login funcionar corretamente;
- logout funcionar corretamente;
- sessão permanecer válida enquanto permitido;
- sessões expiradas forem tratadas automaticamente;
- todas as rotas privadas estiverem protegidas;
- arquitetura estiver preparada para trabalhar com perfis e permissões.

# Sprint 3 — Pipeline (Kanban)

## Objetivo

Construir o principal ambiente de trabalho do CRM.

O Pipeline deverá representar visualmente todo o funil comercial da empresa.

A experiência deverá ser inspirada no Kommo, priorizando rapidez e simplicidade.

---

## Escopo

Implementar:

- Pipeline em formato Kanban;
- múltiplas colunas;
- etapas configuráveis;
- cards de Leads;
- movimentação por Drag & Drop;
- persistência da movimentação;
- busca;
- filtros;
- indicadores por etapa;
- quantidade de Leads por coluna;
- valor estimado por coluna.

Os cards deverão apresentar as principais informações do Lead sem necessidade de abrir detalhes.

Permitir criação rápida de novos Leads diretamente pelo Pipeline.

Preparar estrutura para futura abertura do Lead 360°.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- Pipeline estiver totalmente funcional;
- Drag & Drop persistir corretamente;
- cards atualizarem automaticamente;
- indicadores permanecerem consistentes;
- experiência de uso for rápida e intuitiva.

---

# Sprint 4 — Lead 360°

## Objetivo

Transformar cada card do Pipeline em um ambiente completo de gestão do cliente.

O vendedor deverá conseguir realizar praticamente toda sua rotina comercial sem sair do Pipeline.

---

## Escopo

Ao clicar em um Lead deverá abrir um Drawer lateral contendo todas as informações relacionadas ao cliente.

### Cabeçalho

Exibir:

- Nome;
- Empresa;
- Etapa atual;
- Responsável;
- Valor estimado;
- Origem;
- Status;
- Data de criação.
- foto do responsável;
- cargo do responsável;
- equipe responsável.

Disponibilizar ações rápidas:

- editar;
- mover etapa;
- marcar como ganho;
- marcar como perdido;
- excluir.

---

### Dados Gerais

Cadastrar e editar:

- Nome;
- CPF/CNPJ;
- Telefone;
- WhatsApp;
- E-mail;
- Empresa;
- Cargo;
- Endereço completo.

Todos os campos deverão seguir os padrões definidos em **PADROES.md**.

---

### Dados Comerciais

Permitir cadastrar:

- origem;
- responsável;
- valor estimado;
- probabilidade;
- previsão de fechamento;
- tags;
- responsável pelo Lead;
- equipe responsável.

Permitir alterar o responsável diretamente pelo Drawer.

A lista deverá apresentar apenas usuários permitidos conforme regras de acesso.

---

### Dados de Energia Solar

Preparar estrutura para armazenar:

- consumo mensal;
- valor médio da conta;
- concessionária;
- tipo de imóvel;
- tipo de telhado;
- tipo de ligação;
- área disponível;
- interesse em financiamento.

Nesta sprint apenas armazenar as informações.

Não realizar cálculos.

---

### Timeline

Registrar automaticamente:

- criação;
- alterações;
- mudança de etapa;
- troca de responsável;
- atividades;
- comentários;
- tarefas;
- alteração de responsável;
- alteração de equipe.

Nunca apagar registros.

---

### Atividades

Permitir registrar:

- ligação;
- WhatsApp;
- e-mail;
- reunião;
- visita técnica;
- follow-up.

Cada atividade deverá possuir:

- título;
- responsável;
- data;
- horário;
- descrição;
- status.

---

### Tarefas

Permitir criar tarefas relacionadas ao Lead.

Cada tarefa deverá possuir:

- título;
- descrição;
- responsável;
- prioridade;
- vencimento;
- status.

---

### Observações

Permitir registrar observações internas.

Cada observação deverá possuir:

- autor;
- data;
- hora.

Nunca substituir observações anteriores.

---

### Arquivos

Permitir anexar:

- PDFs;
- fotos;
- planilhas;
- documentos.

Preparar estrutura para evolução futura.

---

### Histórico

Registrar automaticamente todas as alterações relevantes realizadas no Lead.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- todo Lead abrir corretamente o Drawer;
- todas as informações forem persistidas;
- Timeline registrar eventos automaticamente;
- atividades funcionarem;
- tarefas funcionarem;
- observações funcionarem;
- histórico permanecer íntegro;
- toda a experiência ocorrer sem necessidade de sair do Pipeline;
- permitir reatribuição de Leads para outro usuário;
- respeitar permissões de acesso;
- registrar automaticamente mudanças de responsável e equipe.

# Sprint 5 — Agenda Comercial

## Objetivo

Criar um ambiente completo para organização da rotina comercial da equipe.

O CRM deverá permitir que vendedores acompanhem compromissos, tarefas e visitas sem depender de ferramentas externas.

A Agenda deverá se integrar naturalmente ao Lead 360°, permitindo acompanhar todo o histórico de relacionamento com o cliente.

---

## Escopo

Implementar um calendário comercial contendo:

- visualização diária;
- semanal;
- mensal;
- lista de compromissos.

Permitir criar:

- visitas técnicas;
- reuniões;
- ligações;
- follow-ups;
- lembretes;
- tarefas pessoais.

Cada compromisso deverá possuir:

- título;
- descrição;
- data;
- horário inicial;
- horário final;
- responsável;
- Lead relacionado (opcional);
- Cliente relacionado (opcional);
- prioridade;
- status;
- localização;
- observações;
- um usuário;
- uma equipe.

---

### Calendário

O calendário deverá permitir:

- navegar entre períodos;
- visualizar compromissos rapidamente;
- identificar eventos por cores;
- abrir detalhes sem trocar de página;
- editar eventos diretamente.

Permitir arrastar compromissos para alterar horário ou data.

---

### Follow-up

Criar um sistema simples de follow-up.

Permitir definir:

- data;
- horário;
- responsável;
- tipo do contato;
- observações.

Quando chegar o momento do follow-up, o sistema deverá destacá-lo visualmente.

---

### Visitas Técnicas

Permitir cadastrar visitas técnicas contendo:

- cliente;
- endereço;
- responsável;
- data;
- horário;
- observações;
- status.

Cada visita deverá possuir:

- responsável técnico;
- equipe responsável.

Preparar estrutura para futuras Ordens de Serviço.

---

### Tarefas

Centralizar todas as tarefas do usuário.

Cada tarefa deverá possuir:

- prioridade;
- vencimento;
- responsável;
- Lead relacionado;
- observações.

Permitir:

- atribuir tarefa para outro usuário;
- transferir tarefa entre usuários;
- atribuir tarefa para uma equipe.

Permitir concluir tarefas sem abrir o cadastro completo.

---

### Dashboard da Agenda

Exibir:

- compromissos do dia;
- tarefas pendentes;
- tarefas atrasadas;
- visitas agendadas;
- próximos follow-ups.

---

### Permissões

A Agenda deverá respeitar os perfis de acesso.

Permitir visualizar:

- apenas agenda própria;
- agenda da equipe;
- agenda geral.

Conforme permissões do usuário.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- calendário estiver totalmente funcional;
- compromissos forem persistidos corretamente;
- tarefas puderem ser gerenciadas;
- visitas técnicas puderem ser cadastradas;
- follow-ups estiverem integrados ao Lead;
- agenda puder ser utilizada como ferramenta principal da equipe comercial.
- tarefas atribuídas corretamente;
- equipes vinculadas às visitas;
- permissões respeitadas na visualização da agenda.

---

# Sprint 6 — Clientes e Empresas

## Objetivo

Transformar Leads em clientes organizados, mantendo todo o histórico comercial e permitindo relacionamentos entre pessoas, empresas e contatos.

---

## Escopo

Criar o módulo de Clientes contendo:

- cadastro de Pessoa Física;
- cadastro de Pessoa Jurídica;
- empresas;
- contatos;
- endereços;
- histórico.

Permitir converter Leads em Clientes mantendo todo o histórico.

---

### Cadastro

Cada cliente deverá possuir:

- dados pessoais;
- documentos;
- contatos;
- endereço;
- observações;
- responsável.

Todos os campos deverão seguir os padrões definidos em **PADROES.md**.

---

### Empresas

Cada empresa poderá possuir:

- razão social;
- nome fantasia;
- CNPJ;
- inscrição estadual;
- segmento;
- endereço;
- contatos;
- responsável.

---

### Contatos

Cada empresa poderá possuir diversos contatos.

Cada contato deverá possuir:

- nome;
- cargo;
- telefone;
- WhatsApp;
- e-mail;
- observações.

Definir um contato principal.

---

### Histórico

Todo cliente deverá manter:

- histórico de Leads;
- atividades;
- propostas;
- visitas;
- comunicações;
- observações.

Nunca perder histórico.

---

### Pesquisa

Permitir localizar clientes por:

- nome;
- CPF;
- CNPJ;
- telefone;
- e-mail;
- empresa.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- clientes puderem ser cadastrados;
- empresas puderem possuir múltiplos contatos;
- Leads puderem ser convertidos em Clientes;
- todo histórico permanecer preservado;
- pesquisa localizar rapidamente qualquer cliente.

---

# Sprint 7 — Comercial

## Objetivo

Permitir a criação e gestão de propostas comerciais diretamente dentro do CRM.

O vendedor deverá conseguir gerar uma proposta completa sem utilizar documentos externos.

---

## Escopo

Criar o módulo de Propostas.

Cada proposta deverá estar vinculada a um Lead ou Cliente.

---

### Proposta

Permitir informar:

- título;
- cliente;
- vendedor;
- validade;
- valor;
- desconto;
- observações.

---

### Itens

Cada proposta poderá conter diversos itens.

Cada item deverá possuir:

- descrição;
- quantidade;
- unidade;
- valor unitário;
- desconto;
- subtotal.

Calcular automaticamente os totais.

---

### Versionamento

Sempre que uma proposta sofrer alterações relevantes, criar uma nova versão.

Nunca substituir versões anteriores.

Permitir visualizar o histórico de versões.

---

### PDF

Gerar PDF profissional contendo:

- logotipo;
- dados da empresa;
- dados do cliente;
- itens;
- totais;
- condições comerciais;
- observações.

Preparar estrutura para assinatura eletrônica futuramente.

---

### Situação

Cada proposta poderá possuir os status:

- rascunho;
- enviada;
- aprovada;
- recusada;
- expirada.

Registrar todas as alterações na Timeline.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- propostas puderem ser criadas;
- cálculos ocorrerem automaticamente;
- PDFs forem gerados;
- versões permanecerem armazenadas;
- status refletirem corretamente a situação comercial.

---

# Sprint 8 — Energia Solar

## Objetivo

Adicionar inteligência ao CRM com funcionalidades específicas para projetos de energia solar.

Este será o primeiro módulo especializado do sistema.

---

## Escopo

Criar uma área técnica dentro do Lead contendo todas as informações necessárias para elaboração de um projeto fotovoltaico.

---

### Consumo

Permitir informar:

- consumo médio mensal;
- valor médio da conta;
- concessionária;
- classe de consumo.

Registrar histórico de alterações.

---

### Dimensionamento

Permitir informar:

- potência desejada;
- tipo de telhado;
- área disponível;
- tipo de instalação;
- inclinação;
- orientação.

Preparar estrutura para cálculo automático nas próximas evoluções.

---

### Equipamentos

Cadastrar:

- módulos;
- inversores;
- estruturas;
- acessórios.

Preparar estrutura para catálogo de produtos.

---

### Lista de Materiais

Gerar automaticamente uma estrutura de lista de materiais baseada no dimensionamento.

Nesta sprint a lista poderá ser editada manualmente.

---

### Financiamento

Permitir registrar:

- instituição financeira;
- valor financiado;
- entrada;
- parcelas;
- taxa de juros;
- observações.

Preparar estrutura para futuras simulações automáticas.

---

### Economia

Exibir um resumo contendo:

- consumo informado;
- potência prevista;
- economia estimada;
- retorno estimado.

Nesta sprint os valores poderão ser informativos, preparando a base para cálculos futuros.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- todos os dados técnicos puderem ser cadastrados;
- o Lead armazenar informações completas do projeto;
- lista de materiais estiver integrada ao cadastro;
- financiamento puder ser registrado;
- o CRM estiver preparado para futuras automações de dimensionamento e cálculo energético.

# Sprint 9 — Instalação

## Objetivo

Gerenciar toda a etapa de execução da obra após a aprovação da proposta, centralizando as informações da instalação dentro do CRM.

O objetivo é permitir que o setor comercial acompanhe o andamento da instalação sem depender de controles externos.

---

## Escopo

Criar o módulo de Instalação.

Toda instalação deverá estar vinculada a um Cliente e a uma Proposta aprovada.

---

### Ordem de Serviço

Permitir criar Ordens de Serviço contendo:

- número da OS;
- cliente;
- responsável comercial;
- responsável técnico;
- equipe responsável;
- data prevista;
- prioridade;
- endereço da instalação;
- observações.

Cada Ordem de Serviço deverá possuir um status.

Exemplos:

- Aguardando Agendamento;
- Agendada;
- Em Execução;
- Finalizada;
- Cancelada.

---

### Equipes

As equipes deverão utilizar os cadastros criados no módulo **Administração do Sistema**.

Permitir selecionar uma equipe existente para cada instalação.

Cada equipe poderá possuir:

- gestor;
- integrantes;
- responsável técnico.

Não permitir cadastro duplicado de equipes neste módulo.

---

### Checklist

Criar um checklist de instalação.

Exemplos:

- Estrutura instalada;
- Módulos instalados;
- Inversor instalado;
- Cabeamento concluído;
- Testes realizados;
- Sistema energizado;
- Cliente orientado.

Permitir adicionar novos itens conforme necessidade.

---

### Fotos

Permitir anexar fotos da instalação.

Organizar por categorias, como:

- Antes;
- Durante;
- Depois;
- Equipamentos;
- Documentação.

---

### Garantia

Cadastrar:

- data da instalação;
- prazo de garantia;
- fabricante;
- observações.

Preparar estrutura para futuras solicitações de garantia.

---

### Acompanhamento

Exibir uma linha do tempo da instalação contendo:

- criação;
- agendamento;
- início;
- conclusão;
- alterações;
- anexos.

---

### Histórico

Registrar automaticamente:

- criação da instalação;
- alteração de equipe;
- alteração do responsável técnico;
- alteração de status;
- anexos adicionados;
- conclusão da instalação.

Nunca permitir exclusão destes registros.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- Ordens de Serviço puderem ser criadas;
- equipes puderem ser vinculadas corretamente;
- responsáveis técnicos puderem ser definidos;
- checklist estiver funcional;
- fotos puderem ser anexadas;
- garantia puder ser registrada;
- histórico registrar automaticamente todas as alterações relevantes;
- andamento da instalação puder ser acompanhado integralmente dentro do CRM.


# Sprint 10 — Comunicação

## Objetivo

Centralizar toda a comunicação com clientes dentro do CRM, eliminando a necessidade de consultar diversos sistemas.

Toda interação deverá ficar registrada no histórico do Lead ou Cliente.

---

## Escopo

Criar uma Central de Comunicação integrada ao CRM.

---

### WhatsApp

Preparar integração com WhatsApp.

Permitir:

- visualizar conversas;
- enviar mensagens;
- receber mensagens;
- utilizar mensagens prontas;
- registrar automaticamente na Timeline.

A arquitetura deverá permitir utilização da API Oficial da Meta ou Evolution API.

---

### E-mail

Permitir:

- envio de e-mails;
- recebimento;
- registro automático;
- associação ao Lead ou Cliente.

Preparar estrutura para múltiplas contas.

---

### Templates

Criar gerenciamento de modelos para:

- apresentação;
- follow-up;
- proposta;
- visita técnica;
- pós-venda.

Permitir variáveis dinâmicas como:

- nome do cliente;
- empresa;
- valor da proposta;
- data da visita.

---

### Histórico

Toda comunicação deverá aparecer automaticamente na Timeline do Lead.

Nunca permitir perda do histórico.

---

### Comunicação Rápida

Disponibilizar ações rápidas diretamente no Lead:

- ligar;
- enviar WhatsApp;
- enviar e-mail;
- copiar telefone;
- copiar e-mail.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- comunicação estiver centralizada;
- histórico permanecer organizado;
- templates funcionarem;
- Timeline registrar automaticamente todas as interações.

---

# Sprint 11 — Marketing

## Objetivo

Automatizar a entrada de novos Leads e organizar a origem de cada oportunidade comercial.

O CRM deverá ser capaz de identificar de onde veio cada Lead e acompanhar sua eficiência.

---

## Escopo

Criar o módulo de Marketing.

---

### Origens

Cadastrar origens como:

- Google;
- Facebook;
- Instagram;
- Indicação;
- Site;
- WhatsApp;
- Telefone;
- Outros.

Permitir criar novas origens.

---

### Campanhas

Cadastrar campanhas contendo:

- nome;
- origem;
- período;
- investimento;
- observações.

Preparar estrutura para indicadores futuros.

---

### Integrações

Preparar integração com:

- Facebook Ads;
- Instagram;
- Landing Pages;
- Formulários.

Novos Leads deverão entrar automaticamente no Pipeline.

---

### Distribuição

Permitir definir regras de distribuição automática para vendedores.

Exemplos:

- rodízio;
- responsável fixo;
- origem específica.

---

### Indicadores

Exibir:

- Leads por origem;
- Leads por campanha;
- Conversões;
- Taxa de aproveitamento.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- novas origens puderem ser cadastradas;
- campanhas forem organizadas;
- estrutura de integração estiver preparada;
- Leads puderem entrar automaticamente no Pipeline;
- indicadores apresentarem os dados corretamente.

---

# Sprint 12 — Financeiro

## Objetivo

Adicionar controle financeiro ao CRM, permitindo acompanhar receitas, comissões e indicadores relacionados às vendas.

O módulo não pretende substituir um ERP, mas fornecer informações financeiras relevantes para o processo comercial.

---

## Escopo

Criar o módulo Financeiro.

---

### Receitas

Permitir registrar:

- cliente;
- proposta;
- valor;
- data;
- forma de pagamento;
- situação.

---

### Comissões

Cadastrar regras de comissão.

Permitir calcular automaticamente com base nas vendas concluídas.

Registrar:

- vendedor;
- percentual;
- valor;
- situação.

---

### Custos

Permitir registrar custos relacionados aos projetos.

Exemplos:

- equipamentos;
- instalação;
- deslocamento;
- serviços.

---

### Fluxo Financeiro

Exibir:

- receitas previstas;
- receitas recebidas;
- valores pendentes;
- custos;
- saldo.

---

### Indicadores

Disponibilizar:

- faturamento do período;
- ticket médio;
- comissão por vendedor;
- margem estimada;
- evolução mensal.

---

### Relatórios

Permitir exportar relatórios financeiros para consulta.

Preparar estrutura para futuras integrações com sistemas contábeis.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- receitas puderem ser registradas;
- comissões forem calculadas;
- custos puderem ser acompanhados;
- indicadores financeiros estiverem disponíveis;
- relatórios puderem ser gerados.

# Sprint 13 — Inteligência Artificial

## Objetivo

Adicionar recursos de Inteligência Artificial ao CRM para aumentar a produtividade da equipe comercial, reduzir tarefas repetitivas e fornecer apoio na tomada de decisão.

A IA deverá atuar como uma assistente do vendedor, nunca substituindo suas decisões.

---

## Escopo

Criar um módulo de IA integrado ao CRM.

Todos os recursos deverão estar disponíveis diretamente dentro do Lead, evitando que o usuário precise acessar outras telas.

---

### Resumo Inteligente

Permitir gerar automaticamente um resumo do Lead contendo:

- situação atual;
- histórico resumido;
- principais interações;
- objeções levantadas;
- próximos passos sugeridos.

O resumo deverá ser atualizado conforme novas informações forem adicionadas.

---

### Sugestões de Follow-up

A IA deverá analisar o histórico do Lead e sugerir:

- próximo contato;
- melhor momento para retorno;
- possíveis abordagens;
- ações pendentes.

O usuário poderá aceitar ou ignorar as sugestões.

---

### Classificação de Leads

Permitir que a IA atribua uma classificação ao Lead com base nas informações disponíveis.

Exemplos:

- Muito Quente;
- Quente;
- Morno;
- Frio.

A classificação deverá ser apenas uma sugestão e poderá ser alterada manualmente.

---

### Assistente Comercial

Disponibilizar um assistente para auxiliar o vendedor.

Exemplos de uso:

- resumir conversas;
- sugerir respostas;
- gerar textos para WhatsApp;
- gerar e-mails;
- criar observações;
- organizar informações.

---

### Geração de Conteúdo

Permitir gerar automaticamente:

- mensagens de apresentação;
- follow-ups;
- respostas comerciais;
- mensagens de pós-venda.

Sempre permitir edição antes do envio.

---

### Histórico da IA

Registrar:

- quando a IA foi utilizada;
- qual ação foi executada;
- quem solicitou;
- data e horário.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- a IA conseguir resumir Leads;
- sugerir próximos passos;
- auxiliar o vendedor na escrita de mensagens;
- classificar oportunidades;
- permanecer integrada ao fluxo natural do CRM.

---

# Sprint 14 — Dashboard Executivo

## Objetivo

Disponibilizar uma visão estratégica do negócio através de dashboards e indicadores em tempo real.

O gestor deverá conseguir acompanhar toda a operação comercial sem precisar consultar relatórios externos.

---

## Escopo

Criar um Dashboard Executivo totalmente personalizável.

---

### Indicadores Comerciais

Exibir indicadores como:

- Leads cadastrados;
- oportunidades em andamento;
- vendas realizadas;
- taxa de conversão;
- ticket médio;
- faturamento;
- propostas enviadas;
- propostas aprovadas.

---

### Pipeline

Apresentar:

- quantidade de Leads por etapa;
- valor estimado por etapa;
- tempo médio em cada etapa;
- gargalos do funil.

---

### Equipe Comercial

Disponibilizar indicadores por vendedor.

Exemplos:

- número de Leads;
- propostas enviadas;
- vendas realizadas;
- faturamento;
- conversão;
- atividades executadas.

---

### Agenda

Exibir:

- visitas previstas;
- follow-ups pendentes;
- tarefas vencidas;
- compromissos do dia.

---

### Filtros

Permitir visualizar indicadores por:

- período;
- vendedor;
- equipe;
- origem;
- campanha;
- pipeline.

---

### Exportação

Preparar estrutura para exportação dos principais indicadores.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- indicadores forem atualizados corretamente;
- filtros funcionarem;
- Dashboard apresentar visão clara do negócio;
- informações puderem ser utilizadas para tomada de decisão.

---

# Sprint 15 — Multiempresa

## Objetivo

Preparar o CRM para atender múltiplas empresas utilizando uma única plataforma.

Cada empresa deverá possuir ambiente isolado, preservando completamente seus dados e configurações.

---

## Escopo

Implementar suporte a múltiplas empresas.

---

### Empresas

Cada empresa deverá possuir:

- nome;
- logotipo;
- dados fiscais;
- endereço;
- configurações próprias.

---

### Isolamento

Garantir que:

- usuários visualizem apenas dados da própria empresa;
- Leads permaneçam isolados;
- clientes permaneçam isolados;
- propostas permaneçam isoladas;
- arquivos permaneçam isolados.

---

### Usuários

Permitir diferentes perfis de acesso.

Exemplos:

- Administrador;
- Gestor;
- Comercial;
- Técnico;
- Financeiro.

Preparar estrutura para criação de novas permissões.

---

### Personalização

Permitir que cada empresa configure:

- logotipo;
- cores;
- informações institucionais;
- modelos de proposta;
- pipelines;
- etapas.

Preparar estrutura para futura evolução para White Label.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- empresas estiverem isoladas entre si;
- permissões funcionarem corretamente;
- configurações forem independentes;
- arquitetura estiver preparada para comercialização do CRM.

---

# Sprint 16 — Multiempresa

## Objetivo

Preparar o CRM para atender múltiplas empresas utilizando uma única plataforma.

Cada empresa deverá possuir um ambiente completamente isolado, preservando seus dados, usuários, configurações e processos internos.

O objetivo é preparar o sistema para futura comercialização em modelo SaaS.

---

## Escopo

Implementar suporte completo a múltiplas empresas.

---

### Empresas

Cada empresa deverá possuir seus próprios dados institucionais.

Permitir cadastrar:

- Nome;
- Razão Social;
- Nome Fantasia;
- CNPJ;
- Inscrição Estadual;
- Endereço;
- Telefones;
- E-mail;
- Website;
- Logotipo.

Cada empresa deverá possuir seu próprio ambiente administrativo.

---

### Usuários

Cada empresa deverá possuir seus próprios usuários.

Os usuários nunca poderão acessar informações pertencentes a outra empresa.

Cada empresa administrará:

- usuários;
- perfis de acesso;
- equipes;
- permissões.

De forma totalmente independente.

---

### Perfis de Acesso

Cada empresa poderá possuir seus próprios perfis.

Exemplos:

- Administrador;
- Gestor;
- Comercial;
- Instalador;
- Financeiro.

Permitir criação de perfis personalizados.

---

### Equipes

Cada empresa poderá criar suas próprias equipes.

Exemplos:

- Comercial;
- Engenharia;
- Instalação;
- Financeiro;
- Administrativo.

Cada equipe deverá existir apenas dentro da empresa proprietária.

---

### Configurações

Cada empresa deverá possuir configurações independentes.

Exemplos:

- Pipeline;
- Etapas;
- Tags;
- Motivos de perda;
- Horário comercial;
- Modelos de proposta;
- Logotipo;
- Dados institucionais.

Alterações realizadas em uma empresa nunca deverão impactar outra.

---

### Isolamento de Dados

Garantir isolamento completo entre empresas para:

- usuários;
- equipes;
- perfis;
- permissões;
- Leads;
- Pipeline;
- Agenda;
- Clientes;
- Empresas;
- Propostas;
- Instalações;
- Comunicação;
- Marketing;
- Financeiro;
- Arquivos;
- Configurações.

Nenhuma informação poderá ser compartilhada entre empresas sem implementação explícita de uma funcionalidade futura.

---

### White Label

Preparar estrutura para futura evolução para White Label.

Nesta sprint apenas preparar a arquitetura para permitir:

- logotipo personalizado;
- nome da empresa;
- cores institucionais;
- identidade visual.

Não implementar White Label completo nesta etapa.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- empresas estiverem completamente isoladas entre si;
- usuários forem exclusivos de cada empresa;
- equipes forem independentes;
- perfis e permissões funcionarem de forma isolada;
- configurações forem independentes;
- nenhuma informação puder ser acessada entre empresas;
- arquitetura estiver preparada para comercialização do CRM em ambiente SaaS.


# Sprint 17 — Administração do Sistema

## Objetivo

Criar um módulo central de administração do CRM, permitindo gerenciar usuários, equipes, perfis de acesso, permissões e configurações gerais da empresa.

Este módulo será responsável por toda a administração do sistema, eliminando a necessidade de configurações diretamente no banco de dados ou no código.

O objetivo é tornar o CRM preparado para crescimento, múltiplos colaboradores e futura comercialização.

---

## Escopo

Criar um módulo de **Administração** contendo todas as configurações administrativas do CRM.

---

### Dashboard Administrativo

Criar uma visão geral contendo:

- quantidade de usuários;
- usuários ativos;
- usuários bloqueados;
- equipes cadastradas;
- últimos acessos;
- últimas alterações administrativas;
- alertas administrativos.

---

### Usuários

Permitir cadastrar usuários do sistema.

Cada usuário deverá possuir:

- Foto
- Nome completo
- CPF
- E-mail
- Telefone
- Cargo
- Função
- Equipe
- Perfil de acesso
- Status (Ativo/Inativo)
- Último acesso
- Data de criação

Permitir:

- criar;
- editar;
- bloquear;
- desbloquear;
- redefinir senha;
- alterar perfil;
- alterar equipe;
- alterar status.

Nunca excluir usuários definitivamente.

---

### Perfis de Acesso

Criar perfis padrão:

- Administrador
- Gestor Comercial
- Comercial
- Pré-vendas
- Instalador
- Engenharia
- Financeiro
- Pós-venda

Permitir criação de novos perfis personalizados.

Cada perfil deverá possuir:

- nome;
- descrição;
- status;
- permissões.

---

### Permissões

Criar um gerenciamento granular de permissões.

Cada perfil deverá definir quais funcionalidades podem ser:

- visualizar;
- criar;
- editar;
- excluir;
- exportar;
- aprovar;
- administrar.

As permissões deverão ser organizadas por módulos.

Exemplo:

#### Leads

- Visualizar
- Criar
- Editar
- Excluir

#### Pipeline

- Visualizar
- Editar etapas

#### Agenda

- Visualizar apenas própria agenda
- Visualizar agenda da equipe
- Visualizar agenda geral

#### Clientes

- Visualizar
- Editar
- Excluir

#### Propostas

- Criar
- Aprovar
- Cancelar

#### Financeiro

- Visualizar
- Editar
- Exportar

#### Administração

- Gerenciar usuários
- Gerenciar equipes
- Alterar configurações

A estrutura deverá permitir criação de novas permissões sem necessidade de refatoração.

---

### Equipes

Permitir cadastrar equipes.

Exemplos:

- Comercial
- Engenharia
- Instalação
- Financeiro
- Administrativo

Cada equipe deverá possuir:

- nome;
- descrição;
- gestor;
- integrantes.

Um usuário poderá pertencer apenas a uma equipe por vez.

---

### Configurações Gerais

Centralizar todas as configurações da empresa.

#### Empresa

Permitir configurar:

- Nome
- Razão Social
- Nome Fantasia
- CNPJ
- Inscrição Estadual
- Endereço
- Telefones
- E-mail
- Website
- Logotipo

---

#### CRM

Permitir configurar:

- Pipeline padrão
- Etapas padrão
- Motivos de perda
- Prioridades
- Tags
- Tipos de atividade
- Horário comercial
- Dias úteis
- Feriados

---

#### Aparência

Preparar estrutura para:

- Logotipo
- Nome da empresa
- Tema
- Cores institucionais

Preparando o sistema para futura evolução para White Label.

---

### Auditoria

Criar um log administrativo.

Registrar automaticamente:

- login;
- logout;
- criação de usuários;
- alterações de usuários;
- troca de permissões;
- redefinição de senha;
- alterações nas configurações;
- alterações em perfis;
- alterações em equipes.

Cada registro deverá possuir:

- usuário;
- data;
- hora;
- ação executada;
- descrição;
- entidade afetada.

Nunca permitir exclusão destes registros.

---

### Segurança

Preparar configurações para:

- política de senha;
- tempo de sessão;
- bloqueio por tentativas de login;
- autenticação em dois fatores (estrutura preparada);
- recuperação de senha.

Nesta sprint apenas implementar a estrutura necessária.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- usuários puderem ser administrados completamente;
- equipes estiverem funcionais;
- perfis de acesso puderem ser criados e editados;
- permissões forem respeitadas em todo o sistema;
- configurações da empresa estiverem centralizadas;
- auditoria registrar automaticamente todas as alterações administrativas;
- o CRM estiver preparado para crescimento da equipe e futura comercialização.

# Sprint 18 — Design System & Experiência do Usuário (UX)

## Objetivo

Consolidar a identidade visual definitiva do CRM RTSC, transformando todos os módulos em uma experiência moderna, consistente e profissional.

Esta sprint não tem como objetivo adicionar novas funcionalidades, mas elevar toda a interface do sistema ao padrão de um software SaaS comercial de alto nível.

Toda a interface deverá utilizar como base o **shadcn/ui**, seguindo uma identidade visual limpa, organizada e consistente.

O CRM deverá transmitir uma sensação de sistema moderno, rápido e confiável.

---

## Escopo

Realizar uma revisão completa de toda a interface do sistema.

---

### Design System

Padronizar todos os componentes utilizando **shadcn/ui**.

Todos os componentes deverão seguir um único padrão visual.

Padronizar:

- Buttons
- Inputs
- Textareas
- Selects
- Combobox
- Dropdown Menu
- Dialog
- Drawer
- Cards
- Tables
- Badges
- Tooltips
- Tabs
- Popover
- Pagination
- Skeleton
- Toast
- Calendar
- Date Picker
- Time Picker

Não deverão existir componentes duplicados com comportamentos semelhantes.

---

### Identidade Visual

Adotar uma identidade visual clara e moderna.

Padrão principal:

- fundo branco;
- tons de azul como cor primária;
- cinzas suaves para elementos secundários;
- alto contraste para leitura;
- aparência limpa.

Evitar excesso de cores.

As cores deverão ser utilizadas apenas para reforçar significado.

Exemplos:

- Azul → ação principal
- Verde → sucesso
- Amarelo → atenção
- Vermelho → erro
- Cinza → informação secundária

---

### Layout

Revisar todas as telas do sistema.

Padronizar:

- espaçamentos;
- alinhamentos;
- margens;
- largura dos containers;
- altura dos componentes;
- responsividade.

Toda a navegação deverá parecer parte do mesmo sistema.

---

### Tipografia

Padronizar:

- títulos;
- subtítulos;
- textos;
- legendas;
- tabelas;
- formulários.

Criar uma hierarquia visual clara.

---

### Formulários

Revisar todos os formulários.

Garantir:

- alinhamento consistente;
- espaçamento uniforme;
- validações padronizadas;
- mensagens de erro amigáveis;
- foco visual;
- acessibilidade.

Todos os formulários deverão seguir **PADROES.md**.

---

### Tabelas

Revisar todas as tabelas.

Padronizar:

- cabeçalhos;
- paginação;
- filtros;
- busca;
- ordenação;
- estados vazios;
- loading;
- ações rápidas.

---

### Drawers

Todos os Drawers deverão seguir exatamente o mesmo padrão.

Padronizar:

- cabeçalho;
- ações;
- organização das informações;
- largura;
- comportamento de abertura e fechamento.

---

### Dashboard

Revisar todos os Dashboards.

Padronizar:

- Cards;
- KPIs;
- gráficos;
- indicadores;
- espaçamento;
- hierarquia visual.

---

### Kanban

Refinar completamente o Pipeline.

Padronizar:

- largura das colunas;
- aparência dos cards;
- indicadores;
- Drag & Drop;
- animações;
- estados de carregamento.

---

### Lead 360°

Revisar completamente o Drawer do Lead.

Melhorar:

- organização;
- navegação;
- espaçamentos;
- legibilidade;
- usabilidade.

Todo o fluxo deverá permitir gerenciamento rápido do Lead.

---

### Feedback Visual

Padronizar:

- Toasts;
- Skeletons;
- Loadings;
- Empty States;
- Mensagens de erro;
- Mensagens de sucesso.

Todo feedback ao usuário deverá possuir comportamento consistente.

---

### Responsividade

Revisar toda a aplicação para funcionamento adequado em:

- Desktop;
- Notebook;
- Tablet;
- Mobile.

Priorizar Desktop, mantendo boa experiência nos demais dispositivos.

---

### Dark Mode

Preparar toda a interface para suportar Dark Mode futuramente.

Nesta sprint manter o tema principal em **modo claro**, utilizando branco e azul como identidade visual oficial.

---

## Critérios de Aceite

A sprint será considerada concluída quando:

- toda a interface utilizar exclusivamente componentes do shadcn/ui;
- não existirem inconsistências visuais entre módulos;
- todas as telas seguirem a mesma identidade visual;
- formulários obedecerem PADROES.md;
- componentes forem reutilizados sempre que possível;
- o CRM apresentar aparência moderna, limpa e profissional;
- a experiência de uso transmitir a sensação de um software SaaS comercial de alto padrão.