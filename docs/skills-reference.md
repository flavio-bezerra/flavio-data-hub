# Skills de Referência — Casamento Victória & Flávio

> **Nota:** Estas skills **não são skills nativas do OpenCode** (que só tem `opencode`, `report`, `browser`). Esta lista serve como **catálogo de referência** para o time instalar/usar manualmente conforme a origem de cada skill (Anthropic, GitHub, marketplaces, etc.).

---

## 1. Direção Visual e Identidade

| Skill | Origem | Uso Principal |
|-------|--------|---------------|
| `frontend-design` | Anthropic | Definir direção estética, paleta, tipografia, wireframe **antes de codar**. Evita "visual genérico de IA". |
| `canvas-design` | Anthropic | Gerar arte visual original (PNG/PDF) a partir de "filosofia visual" nomeada. Moodboards e referências de estilo. |
| `brand-designer` | oakoss | Sistema de identidade completo: logo, paleta com acessibilidade, escala tipográfica, guia de marca. |
| `brand-book` | ordinarynerds | Transformar assets brutos (logo, cores, fontes) em brand book com tokens de cor e voz de marca aplicáveis no código. |
| `taste-brandkit` / `brandkit` | vários | Geração de brand boards, moodboards, paletas — visualizar direção antes de baixar texturas/flores. |

---

## 2. Tipografia e Fontes

| Skill | Origem | Uso Principal |
|-------|--------|---------------|
| `web-typography-skill` | simongonzalezdc | Tipografia web legível/acessível: pareamento, escala fluida `clamp()`, carregamento de web fonts, prevenção CLS, WCAG. |
| `better-typography` | jakubkrehel | Revisa renderização de texto: escala, espaçamento, wrapping, truncamento, pontuação. |
| `frontend-design` | Anthropic | Também cobre tipografia: escala, pesos, espaçamento; alerta contra "tells" genéricos (itálico/bold em 1 palavra, all-caps em labels). |

---

## 3. Cor e Paleta

| Skill | Origem | Uso Principal |
|-------|--------|---------------|
| `color-palette` | eliteai.tools | Paleta completa 11 tons (50–950) a partir de hex, tokens semânticos, dark mode, contraste WCAG. |
| `color-palette` | ArnavPuri/designskills | Teoria da cor, geração de paleta, cores acessíveis. |
| `brand-designer` | oakoss | Inclui paleta com compliance acessibilidade + integração Tailwind. |

---

## 4. Acessibilidade

| Skill | Origem | Uso Principal |
|-------|--------|---------------|
| `better-accessibility` | jakubkrehel | Revisa/corrige: teclado, foco, ARIA, nomes acessíveis, formulários, screen reader, motion, zoom — WCAG 2.2. |
| `accessibility` | Addy Osmani | Auditoria WCAG 2.2 com fluxo de remediação: alt text, contraste, navegação teclado, foco, tech assistivas. |
| `web-design-guidelines` | Vercel Labs | Revisão UI focada: acessibilidade, UX patterns, formulários, tipografia, performance — findings por arquivo:linha. |

---

## 5. Geração de Assets (Flores, Texturas)

| Skill | Origem | Uso Principal |
|-------|--------|---------------|
| `image-generation` | ArnavPuri/designskills | Pipeline Gemini Flash: text-to-image, edição, refinamento multi-turn. Variações de flores/texturas no estilo do site. |
| `canvas-design` | Anthropic | Arte final PNG/PDF com composição e cor intencionais (além de moodboard). |
| `logo-generator-skill` | SanbaoAI | Boards de identidade com paleta, mockups, variações de cor — referência de composição. |

---

## 6. Revisão e Refinamento Visual

| Skill | Origem | Uso Principal |
|-------|--------|---------------|
| `better-interface` | jakubkrehel | Revisa tela/fluxo/interface inteira: acessibilidade, layout, escrita, tipografia, cor, polish — relatório ranqueado. |
| `web-design-guidelines` | Vercel | Review pass pós-implementação, findings em formato `arquivo:linha`. |
| `frontend-design` | Anthropic | Guia de refinamento: hero, hierarquia, dispositivos estruturais (bordas, divisores, labels). |

---

## 7. Testes e Performance

| Skill | Origem | Uso Principal |
|-------|--------|---------------|
| `Playwright skills` | vários | Testes E2E, visual regression, performance (Core Web Vitals, Lighthouse), acessibilidade em fluxos reais. Valida que texturas/flores não quebram layout/performance. |

---

## Como Instalar / Usar

### Skills Anthropic (frontend-design, canvas-design)
- Disponíveis no **Anthropic Console** → Skills / Prompt Library
- Ou via **Claude Code** (se habilitado)

### Skills GitHub / Open Source
```bash
# Exemplo genérico — varia por skill
git clone https://github.com/<owner>/<skill-repo>
cd <skill-repo>
# Seguir README da skill (npm install, pnpm, python, etc.)
```

### Skills de Marketplace (eliteai.tools, ArnavPuri/designskills, etc.)
- Verificar documentação de cada provedor
- Muitas são chamadas via API (Gemini, OpenAI) — não "instaladas" localmente

### Skills Oakoss / OrdinaryNerds / SanbaoAI
- Procurar no GitHub ou npm: `npm search oakoss brand-designer`
- `brand-book` (ordinarynerds): `npx @ordinarynerds/brand-book`

---

## Fluxo Recomendado para Este Projeto

```
1. frontend-design (Anthropic)        → Definir direção visual completa (já feito em docs/identidade-e-layout.md)
2. brand-designer (oakoss)            → Gerar tokens Tailwind + paleta acessível a partir do hex
3. color-palette (eliteai.tools)      → Expandir 11 tons (50-950) + dark mode
4. web-typography-skill               → Validar escala fluida clamp(), pareamento Italianno/Cormorant/Newsreader
5. canvas-design / image-generation   → Gerar variações de flores/texturas no estilo Herbário
6. brand-book                         → Compilar brand book final (tokens, voz, uso)
7. better-accessibility / accessibility → Auditoria WCAG 2.2 pré-lançamento
8. web-design-guidelines (Vercel)     → Review pass final por arquivo:linha
9. Playwright skills                  → E2E + visual regression + Core Web Vitals
```

---

## Tokens Já Definidos no Projeto (src/index.css)

```css
:root {
  /* Azul névoa / ardósia */
  --color-blue-50:  #f0f4f8;
  --color-blue-100: #d9e2ec;
  --color-blue-200: #bcccdc;
  --color-blue-300: #9fb3c8;
  --color-blue-400: #829ab1;
  --color-blue-500: #627d98;
  --color-blue-600: #486581;
  --color-blue-700: #334e68;
  --color-blue-800: #243b53;
  --color-blue-900: #102a43;
  --color-blue-950: #0c1e2e;

  /* Verde eucalipto / tinta */
  --color-green-50:  #f0f4f0;
  --color-green-100: #d9e2d9;
  --color-green-200: #bccdbd;
  --color-green-300: #98b398;
  --color-green-400: #769876;
  --color-green-500: #567d56;
  --color-green-600: #3d623d;
  --color-green-700: #2a4a2a;
  --color-green-800: #1a331a;
  --color-green-900: #0d1f0d;
  --color-green-950: #071007;

  /* Branco papel */
  --color-paper: #faf9f6;

  /* Marrom claro / linho */
  --color-linen-50:  #f5f0eb;
  --color-linen-100: #ebe1d7;
  --color-linen-200: #d6c3b0;
  --color-linen-300: #c1a589;
  --color-linen-400: #ac8762;
  --color-linen-500: #976940;
  --color-linen-600: #7d5433;
  --color-linen-700: #634029;
  --color-linen-800: #4a3020;
  --color-linen-900: #332015;
  --color-linen-950: #1a100b;

  /* Tipografia */
  --font-display: 'Italianno', cursive;           /* Nomes do casal, títulos de seção */
  --font-elegant: 'Cormorant Garamond', serif;    /* Data, horários, valores */
  --font-body: 'Newsreader', serif;               /* Corpo de texto */
}
```

---

## Próximos Passos Sugeridos

1. **Instalar `brand-designer` (oakoss)** para validar/expandir tokens Tailwind a partir dos hex acima
2. **Usar `color-palette` (eliteai.tools)** para gerar os 11 tons completos + dark mode automático
3. **Rodar `web-typography-skill`** para validar `clamp()` e pareamento Italianno/Cormorant/Newsreader
4. **Gerar assets finais** com `canvas-design` ou `image-generation` (Gemini Flash) para flores/texturas
5. **Compilar brand book** com `brand-book` (ordinarynerds)
6. **Auditoria completa** com `better-accessibility` + `web-design-guidelines` antes do deploy

---

*Documento criado em 10/11/2026 — Catálogo de referência para o time*