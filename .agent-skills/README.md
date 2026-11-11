# Agent Skills — Casamento Victória & Flávio

> **37 skills portáteis** copiadas do `@its-thepoe/skills` para uso com **qualquer agente**: OpenCode, Claude Code, Cursor, Windsurf, Codex, etc.

---

## Skills Incluídas (por Categoria)

### Direção Visual e Identidade
| Skill | Descrição |
|-------|-----------|
| `frontend-design` | **Principal** — Interfaces distintas, produção-grade, evita estética genérica de IA |
| `design-taste-frontend` | Senior UI/UX Engineer — Arquitetura componentes, CSS hardware acceleration |
| `design-engineering` | UI craft: motion, easing, component feel, polish (estilo Emil Kowalski) |
| `high-end-visual-design` | Projetar como agência high-end — fontes, spacing, shadows, cards, animações |
| `stitch-design-taste` | Design System semântico (Google Stitch) — DESIGN.md com tipografia strict, cor calibrada |
| `design-and-refine` | Workflow 0x Designer: múltiplas variações UI, comparação side-by-side, síntese |
| `redesign-existing-projects` | Upgrade sites/apps existentes para qualidade premium |
| `agentic-design-engineering` | Multi-agent reasoning: Specify → Plan → Build → Critique → Fix → Verify |
| `gpt-taste` | Elite UX/UI + GSAP: randomização Python, AIDA structure, bento grids |
| `family-taste` | Family Values UI: Simplicity, Fluidity, Delight |

### Tipografia
| Skill | Descrição |
|-------|-----------|
| `better-typography` | **Principal** — Tipografia web: pareamento, escala `clamp()`, variable fonts, OpenType, WCAG |

### Cor e Paleta
| Skill | Descrição |
|-------|-----------|
| `better-colors` | **Principal** — OKLCH color space: paletas, contraste, gamut, Tailwind v4 |

### Acessibilidade
| Skill | Descrição |
|-------|-----------|
| `alt-text` | Escaneia imagens para alt text faltando/baixa qualidade |
| `better-accessibility` *(via npm)* | WCAG 2.2 completo: teclado, ARIA, screen reader, motion, zoom |
| `web-design-guidelines` *(via npm)* | Review UI: acessibilidade, UX, formulários, tipografia, performance |

### Geração de Assets (Flores, Texturas)
| Skill | Descrição |
|-------|-----------|
| `image-to-code` | **Principal** — Image-to-code elite: gera design, analisa, implementa matchando |
| `unsplash-asset-images` | Busca imagens Unsplash de alta qualidade (avatars, backgrounds, wallpapers) |
| `aura-asset-images` | Busca imagens Aura Assets (similar ao Unsplash) |
| `prototype` | 5 direções UI diferentes, working HTML prototype |

### Revisão e Refinamento Visual
| Skill | Descrição |
|-------|-----------|
| `better-ui` | Design engineering: polish, micro-interactions, hover, shadows, borders |
| `design-motion-principles` | Expert motion auditor (Emil Kowalski, Jakub Krehel, Jhey Tompkins) |
| `animation-systems` | Product-grade motion (Stripe, Linear, Apple, Vercel) |
| `gsap` / `gsap-scrolltrigger-storytelling` | GSAP timelines, ScrollTrigger, choreografia |
| `beautiful-shadows` | Tailwind arbitrary shadows polidos, layered neutral elevation |
| `css-border-gradient` | Gradient borders via masked pseudo-elements |
| `progressive-blur` | Layered backdrop blur gradients |
| `container-lines` | Vertical guide lines com corner squares para layout preciso |
| `framed-grid-layout` | Minimal framed grids com boundary lines, L-brackets, diagonal texture |
| `corner-diagonals` | Diagonal-cut corners, chamfered edges para buttons/cards/panels |
| `company-logos` | Iconify Simple Icons (64x64) no lugar de text logos |

### Landing Pages e Copy
| Skill | Descrição |
|-------|-----------|
| `landing-page` | High-converting landing pages: structure, copywriting, SEO/AEO |
| `copywriting` | UX writing, microcopy, product copy, voice & tone, CTA |

### Testes, Performance e Deploy
| Skill | Descrição |
|-------|-----------|
| `playwright` | Browser automation: navegação, forms, snapshots, screenshots |
| `optimize-web-animations` | Profile/audita animações: CSS, canvas/WebGL, GSAP, memory leaks |
| `stitched-full-page-capture` | Screenshots full-page confiáveis (lazy-loaded, scroll-animated, WebGL) |
| `netlify-deploy` | Deploy via Netlify CLI |
| `seo-audit` | Auditoria SEO técnica, Core Web Vitals, crawl errors |
| `full-output-enforcement` | Anti-truncation: output completo, bans placeholders |
| `write-a-skill` | Criar/editar/verificar Agent Skills portáteis (SKILL.md) |

---

## Como Usar

### Com OpenCode
```bash
# Skills já estão em ~/.config/opencode/skills/ (instalação global)
# Ou aponte para a pasta local:
opencode --skills-dir ./.agent-skills
```

### Com Claude Code
```bash
# No projeto, adicione ao settings ou use --skill-dir
claude-code --skill-dir ./.agent-skills
```

### Com Cursor / Windsurf / Codex
- Configure o diretório de skills nas configurações da extensão
- Ou copie skills individuais para `.cursor/skills/`, `.windsurf/skills/`, etc.

### Uso Direto (qualquer agente)
Cada skill é uma pasta com `SKILL.md` + `reference.md` (se houver). Leia o `SKILL.md` para saber como invocar.

---

## Estrutura de Cada Skill
```
.agent-skills/
├── frontend-design/
│   ├── SKILL.md          # Definição da skill (trigger, descrição, uso)
│   └── reference.md      # Documentação técnica (se aplicável)
├── better-typography/
│   ├── SKILL.md
│   └── reference.md
└── ...
```

---

## Atualização
```bash
# Atualizar do npm e recopiar
cd skills
npm update @its-thepoe/skills @its-thepoe/frontend-design @its-thepoe/better-typography ...
npx @its-thepoe/skills install --all --only=opencode --strategy copy
# Depois copiar manualmente as pastas atualizadas para .agent-skills/
# Ou rodar script de sync (ver package.json raiz)
```

---

## Skills-Chave para Este Projeto (Ordem Recomendada)

1. **`frontend-design`** — Definir hero, seções, identidade Herbário
2. **`better-typography`** — Validar escala `clamp()`, pareamento Italianno/Cormorant/Newsreader
3. **`better-colors`** — Expandir paleta azul/verde em 11 tons OKLCH + dark mode
4. **`image-to-code`** / **`prototype`** — Gerar variações de flores/texturas no estilo
5. **`design-motion-principles`** / **`animation-systems`** — Motion polido (GSAP/ScrollTrigger)
6. **`better-ui`** — Polish final: shadows, borders, micro-interactions
7. **`alt-text`** — Auditar imagens (flores, texturas) para acessibilidade
8. **`playwright`** / **`optimize-web-animations`** — Testes E2E + performance
9. **`copywriting`** — Textos finais: convite, programa, etiquetas, cartão-resposta
10. **`seo-audit`** / **`stitched-full-page-capture`** — Pré-deploy check

---

*Copiado de `@its-thepoe/skills` em 10/11/2026 — 37 skills portáteis para OpenCode, Claude Code, Cursor, Windsurf, Codex*