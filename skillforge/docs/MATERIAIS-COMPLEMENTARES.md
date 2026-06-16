# Materiais Complementares — SkillForge

## 1. Wireframes (estrutura das telas)

Wireframes textuais das principais telas implementadas.

### Landing (pública)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo SkillForge]     Benefícios  Planos  [Entrar] [CTA]│
├─────────────────────────────────────────────────────────┤
│         [Badge: Plataforma B2B de gamificação]          │
│   Gamifique QUALQUER conteúdo do seu cliente            │
│   [Sou empresa]  [Sou aluno]                            │
├─────────────────────────────────────────────────────────┤
│  Como funciona: 4 cards (Org → Upload → Config → Aluno) │
│  Exemplo Alpha Pré-Vestibular + card upload/gamificação │
└─────────────────────────────────────────────────────────┘
```

### Admin — Gerenciar conteúdos

```
┌──────────┬──────────────────────────────────────────────┐
│ Sidebar  │  Gerenciar conteúdos                          │
│          │  ┌─ Form upload: título, arquivo PDF/img ─┐  │
│ Dashboard│  └─────────────────────────────────────────┘  │
│ Conteúdos│  [Card PDF] [Card Imagem] [Card PDF]         │
│ Missões  │  Publicar / Excluir / Abrir                  │
│ Config   │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Aluno — Biblioteca de conteúdos

```
┌──────────┬──────────────────────────────────────────────┐
│ Sidebar  │  Conteúdos — Alpha Pré-Vestibular            │
│          │  [Msg boas-vindas da org]                    │
│ Dashboard│  ┌ Lista ─┐  ┌ Visualizador ──────────────┐  │
│ Conteúdos│  │ Mat PDF │  │ iframe PDF / img preview  │  │
│ Atividades│ │ Redação │  │                           │  │
│ Ranking  │  └─────────┘  └───────────────────────────┘  │
└──────────┴──────────────────────────────────────────────┘
```

### Ranking da turma

```
┌─────────────────────────────────────────────────────────┐
│              🏆 Ranking da turma (8 participantes)        │
│     [2º]      [1º Ana]      [3º]   ← pódio top 3        │
├─────────────────────────────────────────────────────────┤
│  # │ Nome          │ Level │ XP    │ Streak            │
│  4 │ Pedro Lima    │  8    │ 1340  │ 🔥 4              │
│  5 │ Aluno Demo    │  6    │ 850   │ 🔥 5              │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Protótipos

O protótipo funcional está implementado no próprio repositório:

| Ambiente | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001/api |
| Health | http://localhost:3001/api/health |

**Contas demo:** ver README.md

---

## 3. Assets utilizados

| Asset | Origem | Uso |
|-------|--------|-----|
| **Inter** | Google Fonts | Tipografia principal |
| **Lucide React** | npm | Ícones da interface |
| **DiceBear Avataaars** | API pública | Avatares dos usuários seed |
| **Unsplash** | URLs no seed | Imagens de conteúdo exemplo |
| **W3C dummy PDF** | URL no seed | PDF de demonstração |
| **Gradientes CSS** | Custom (Tailwind) | Tema neon / acentos |
| **Vite SVG** | `frontend/public/` | Favicon padrão |

Uploads do cliente ficam em `backend/uploads/{organizationId}/` (gerados em runtime).

---

## 4. Documentações adicionais

| Documento | Caminho |
|-----------|---------|
| README principal | [../README.md](../README.md) |
| Documentação da solução | [DOCUMENTACAO-SOLUCAO.md](./DOCUMENTACAO-SOLUCAO.md) |
| Banco de dados | [BANCO-DE-DADOS.md](./BANCO-DE-DADOS.md) |
| Checklist de entrega | [ENTREGA.md](./ENTREGA.md) |
| Schema Prisma | [../backend/prisma/schema.prisma](../backend/prisma/schema.prisma) |
| Seed | [../backend/prisma/seed.js](../backend/prisma/seed.js) |

---

## 5. Screenshots (capturas para banca)

Recomendado anexar na apresentação:

1. Landing B2B (tema claro e escuro)
2. Upload de conteúdo (admin)
3. Biblioteca PDF/imagem (aluno)
4. Dashboard com gráficos
5. Ranking com pódio
6. Missões + popup de XP
7. Skill Tree
8. Tela de planos (monetização)

*(Screenshots podem ser exportadas manualmente durante a demo local.)*
