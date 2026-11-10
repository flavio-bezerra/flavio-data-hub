# Identidade visual e layout — Victória & Flávio

Atualizado em 10/11/2026. Direção solicitada pelo casal: elegante, fina, clássica e botânica. Documento do refinamento implementado; aprovação da direção e autorização de publicação não substituem aceite visual final do casal.

## Grafia e personalidade

Use Victória & Flávio, com acento em Victória, no conteúdo, título da aba, metadados, manifesto e nomes acessíveis. Caminhos técnicos históricos, domínio e repositório podem conservar grafia sem acento. O site é uma extensão da papelaria do casamento, não uma interface corporativa ou portfólio.

Direção atual: **Herbário**. O site é um álbum botânico do casamento: pranchas botânicas antigas de domínio público (copo-de-leite, orquídea e violeta) são protagonistas, com legenda de crédito na abertura. As rosas de Redouté usadas nas primeiras versões foram substituídas a pedido do casal. Cada seção imita uma peça de papelaria (etiqueta, programa impresso, coluna de livro, notas, cardápio, cartão-resposta) em vez de componentes genéricos de interface. A direção foi aprovada pelo casal; as manchas soltas do papel foram removidas das pranchas (ver origem-botanica.md).

## Paleta

Pedido do casal: **azul, verde, branco e marrom claro**, as quatro famílias compostas na página. Os hex são aproximações aprovadas, não especificações de impressão. Estão definidos como variáveis CSS (--papel, --nevoa, --ardosia etc.) e tokens HSL em src/index.css.

| Nome | Hex | Uso | Proporção aproximada |
|---|---|---|---|
| Papel (branco quente) | #FAF8F3 | Fundo principal, história, orientações, folhas de cardápio e cartão | ~55% |
| Azul névoa | #D3DFEA / #E6EDF3 | Fundo do programa e da presença (não usar atrás das pranchas) | ~15% |
| Azul ardósia | #34506A | Botão principal, títulos de seção, nomes, valores, capitular | ~5% |
| Eucalipto | #7E8F78 (texto grande #5F7259) | Ampersand, horários do programa | ~7% |
| Verde tinta | #2F3F35 / #4D5A49 | Texto corrido e secundário | ~8% |
| Linho | #E8DDCB | Fundo dos presentes (rodapé agora em branco papel) | ~6% |
| Marrom claro | #B59E80 (texto #7A644A) | Fios, bordas, pontilhados, rótulos e legendas | ~3% |

Contraste: texto corrido usa verde tinta ou ardósia sobre papel/névoa/linho. Eucalipto e marrom claro puros aparecem só em texto grande ou em elementos decorativos; texto pequeno marrom usa #7A644A. O token técnico champagne agora aponta para o marrom claro.

## Tipografia

Italianno (caligrafia clássica, letras desenhadas) nos nomes do casal (abertura e rodapé) e nos títulos de seção; Cormorant Garamond em data, horários, perguntas e valores; Newsreader (serifada literária) em corpo e interface; versaletes (all-small-caps) para rótulos de herbário. Great Vibes e Pinyon Script foram avaliadas e preteridas. O casal pediu Sweet Fancy Script (MVB Fonts) para os nomes; é fonte paga, disponível via Adobe Fonts (Web Project) ou licença web da MVB. Sem licença, a Italianno permanece; nunca baixar cópias não licenciadas. O monograma usa o desenho fornecido pelo casal e não uma recomposição tipográfica. Famílias e fallbacks estão no CSS; conferir o carregamento de fontes no build real.

Nomes em caligrafia, escala grande e alinhamento escalonado à esquerda, com o ampersand menor em eucalipto. Texto de corpo deve permanecer legível no celular; labels pequenos e espaçados são apenas auxiliares, nunca a única forma de transmitir informação essencial.

## Assets e origem

public/monograma-vf.png: desenho original extraído da imagem enviada, com transparência. É raster PNG, não vetorização. Preserve proporção, evite distorção e repetição desnecessária. Se for solicitado um SVG genuíno, obtenha o original ou faça uma etapa de vetorização com revisão própria; mudar a extensão não cria um vetor.

Pranchas botânicas antigas em public/, todas com fundo transparente e fonte/licença em origem-botanica.md. Flores escolhidas pelo casal: copo-de-leite, orquídea e violeta (as rosas e demais Redouté saíram). Copo-de-leite (abertura; recorte da flor na presença), violeta (ramo na história; parte superior nas orientações), orquídea Phalaenopsis branca (programa e presentes). A violeta lilás é o único toque de cor fora da paleta, pontual. Regras: uma flor por seção; cores da própria aquarela dentro da paleta (azuis, brancos, verdes), sem recolorir; **flor sempre sobre papel branco** — em seções com fundo névoa ou linho ela fica dentro da folha/cartão branco; raízes, bulbos, legendas e esboços removidos. Pranchas antigas fora de uso ficam em .local/ (ignorada pelo Git), não em public/.

public/rosas-botanicas.png (sem uso na página; mantida no repositório): gravura Vintage roses, FreeSVG/OpenClipart ID74999, recolorida em sálvia e com transparência. A página declara CC0/domínio público. O download vetorial não forneceu conteúdo durante a obtenção; foi utilizada a prévia PNG. Origem em origem-botanica.md. Assets estão no próprio projeto; a renderização não depende de hotlink ao catálogo externo.

Referências de layout são inspiração, não licença para copiar templates ou suas imagens. Registre fonte, licença e adaptações para qualquer novo asset. Elementos puramente decorativos têm alt vazio e não interceptam clique.

## Composição por seção

| Área | Direção e comportamento |
|---|---|
| Cabeçalho | Monograma pequeno, navegação compacta e menu móvel em fluxo; aviso de demonstração enquanto necessário |
| Abertura | Copo-de-leite grande à direita sobre papel liso (a névoa azul atrás da planta foi rejeitada); nomes em caligrafia Italianno escalonados; data em destaque (dia da semana · 10 grande em ardósia · mês e ano, só tipografia e espaço; fios marrons rejeitados por parecerem dourados) e linha em itálico com horário e local; a etiqueta em tabela foi rejeitada; botão ardósia “Responder ao convite” e link “Programa do dia”; legenda da prancha. No celular a prancha fica acima dos nomes |
| História | Coluna de livro com capitular ardósia e citação de Alberto Caeiro com fio marrom; texto/fotos pessoais somente após aprovação |
| Evento | Folha branca de programa sobre névoa clara: horários em itálico à esquerda, cerimônia e recepção, orquídea dentro da folha (no celular acima do texto); endereço pendente |
| Orientações | Notas sempre visíveis em duas colunas (lista de definições), “Em definição” onde faltar política |
| Presentes | Cardápio de papel sobre linho, valores alinhados por pontilhado; itens ilustrativos e pagamento desabilitado |
| Presença | Cartão-resposta de papel sobre névoa, com linha “aceita com alegria” decorativa, campo de código sublinhado e botão ardósia; formulário por pessoa em rota própria |
| Rodapé | Branco papel com fio marrom, nomes em Italianno, monograma, nomes em ardósia, data/cidade e retorno ao início |

A primeira tentativa com ramos SVG geométricos grandes, moldura dupla e painel de monograma foi rejeitada e não publicada. O refinamento substituiu esses elementos por gravura orgânica pequena, removeu a moldura e simplificou a história. Não reintroduza esse conjunto por reutilização de uma versão antiga.

## Arquivos responsáveis

src/pages/SaveTheDate.tsx compõe a página. src/features/casamento/conteudo.ts concentra fatos. Abertura.tsx, Cabecalho.tsx, NossaHistoria.tsx, Evento.tsx, Orientacoes.tsx e Rodape.tsx implementam as seções. Monograma.tsx apresenta o monograma; RamoBotanico.tsx ficou sem uso. As flores são <img> decorativas (alt vazio, aria-hidden, loading lazy fora da abertura) em cada componente de seção, com estilos .flor-* e .programa-prancha em src/index.css. src/features/presentes/ e src/features/presenca/ cuidam dos domínios correspondentes. src/index.css contém tokens e estilo editorial. index.html e public/site.webmanifest contêm identidade fora do corpo da página.

## Responsividade, acessibilidade e movimento

Aceite esperado: 320px sem rolagem horizontal; imagens carregadas e proporcionais; menu acessível; H1 único e H2 por seção; foco visível; teclado; alvos de toque de pelo menos 44px; contraste AA; campos rotulados e erros recuperáveis; âncoras sem títulos cobertos pelo cabeçalho. Overlay futuro deve usar Radix/createPortal quando necessário; o menu atual em fluxo não exige overlay.

Movimento é discreto e respeita prefers-reduced-motion. Conteúdo deve continuar visível sem execução de animações. Efeitos não podem ser condição para exibir nomes, data ou controles.

## Evidência e limites da revisão

Versão com copo-de-leite, orquídea, violeta, Italianno e rodapé branco (10/11/2026): TypeScript, lint (0 erros, 7 warnings existentes) e build aprovados; validação CDP 320/390/1280 sem overflow, nome, monograma, prancha da abertura e fontes (Italianno, Cormorant, Newsreader) carregadas, menu móvel aberto; captura desktop inspecionada. A captura headless de celular sai cortada pela largura mínima da janela do Chrome; conferir em aparelho real.

Esses testes não constituem auditoria WCAG completa, teste em Safari/iOS real, aceite visual final ou validação de produção. Após cada alteração relevante, repetir as verificações, inspecionar telas reais e registrar o que foi efetivamente exercitado. Aprovação do CSS/JS por HTTP e hash comprova entrega de bytes, não estética.

## Mudanças futuras

Texto da história, fotos do casal, traje, endereço completo, mapa e demais políticas aguardam conteúdo aprovado. Preserve os dados conhecidos e a indicação de pendência até decisão. Mudanças de identidade devem ser apresentadas com arquivos exatos e plano para aprovação; referências novas precisam harmonizar com a paleta e o monograma, não substituí-los silenciosamente.
