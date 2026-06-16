# Checklist de Entrega — Hackathon SENAI DESI

## 1. Código-fonte completo

| Componente | Localização | Status |
|------------|-------------|--------|
| **Front-end** | `/frontend` | ✅ React + Vite |
| **Back-end** | `/backend` | ✅ Node.js + Express |
| **Banco de dados** | `/backend/prisma/` | ✅ Schema + seed + config |

### Banco — scripts e configurações

| Arquivo | Descrição |
|---------|-----------|
| `backend/prisma/schema.prisma` | Schema completo (models, enums, relações) |
| `backend/prisma/seed.js` | Script de população (dados demo) |
| `backend/.env.example` | Configuração de ambiente |
| `docker-compose.yml` | MySQL 8 (opcional) |
| `scripts/setup-local.sh` | Setup automatizado local |

---

## 2. README.md obrigatório

Arquivo: **[../README.md](../README.md)**

Contém:

- [x] Nome do projeto
- [x] Problema / desafio abordado
- [x] Integrantes da equipe (tabela editável)
- [x] Tecnologias utilizadas
- [x] Funcionalidades implementadas
- [x] Estrutura do banco de dados
- [x] Modelo de monetização
- [x] Instruções para execução local
- [x] Link do deploy (informado como execução local)

---

## 3. Documentação da Solução

Arquivo: **[DOCUMENTACAO-SOLUCAO.md](./DOCUMENTACAO-SOLUCAO.md)**

Contém:

- [x] Nome da solução
- [x] Público-alvo
- [x] Problema resolvido
- [x] Diferencial da solução
- [x] Modelo de monetização e justificativa

---

## 4. Banco de Dados

Arquivo: **[BANCO-DE-DADOS.md](./BANCO-DE-DADOS.md)**

Contém:

- [x] Diagrama ER (Mermaid)
- [x] Scripts de criação (`db:push`, `db:seed`)
- [x] Arquivos de configuração

---

## 5. Materiais Complementares

Arquivo: **[MATERIAIS-COMPLEMENTARES.md](./MATERIAIS-COMPLEMENTARES.md)**

Contém:

- [x] Wireframes (estrutura textual)
- [x] Protótipo funcional (URLs locais)
- [x] Assets utilizados
- [x] Documentações adicionais

---

## Repositório Git

https://github.com/dourado99k/HACKATON
