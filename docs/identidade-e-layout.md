# Identidade visual e layout — Victória & Flávio

Atualizado em 10/11/2026. Direção solicitada pelo casal: elegante, fina, clássica e botânica. Documento do refinamento implementado; aprovação da direção e autorização de publicação não substituem aceite visual final do casal.

## Grafia e personalidade

Use Victória & Flávio, com acento em Victória, no conteúdo, título da aba, metadados, manifesto e nomes acessíveis. Caminhos técnicos históricos, domínio e repositório podem conservar grafia sem acento. O site é uma extensão da papelaria do casamento, não uma interface corporativa ou portfólio.

A referência fornecida combina rosas claras, folhagens sálvia/eucalipto e azuis suaves. Trabalhe com decoração orgânica discreta e hierarquia tipográfica. Sofisticação vem de proporção, ritmo, alinhamento e cuidado no detalhe, não de mais efeitos.

## Paleta de referência

Os hex abaixo são aproximações da referência enviada, não especificações oficiais de impressão. Os tokens HSL de src/index.css são a fonte do comportamento implementado; nem todas as cores de referência têm uso direto em um token.

| Nome | Hex de referência | Papel |
|---|---|---|
| Eucalipto | #73816E | Gravura e detalhes |
| Sálvia | #9DAA96 | Divisórias e superfícies |
| Azul acinzentado | #899EAB | Contraponto discreto |
| Azul névoa | #C3D1E0 | Fundos suaves |
| Marfim | #F4F2EB | Base e rodapé |
| Verde profundo | #34463B | Texto e ações com contraste |

A abertura implementada usa #F8F7F2; história #E8EDE6; orientações #E6EDF2; presença #E1E7DF. Verde profundo funciona como âncora de legibilidade. O nome técnico champagne permanece em algumas classes por compatibilidade, mas seu token atual é sálvia; não interpretar o nome como pedido de restaurar dourado predominante. Avalie contraste de texto/controle, não use a paleta clara indistintamente em conteúdo informativo.

## Tipografia

Cormorant Garamond em nomes e títulos; Montserrat em interface e corpo; Great Vibes restrita a detalhes caligráficos. O monograma usa o desenho fornecido pelo casal e não uma recomposição tipográfica. Famílias e fallbacks estão no CSS; conferir o carregamento de fontes no build real.

Nomes têm peso leve, escala fluida e leitura central. Em telas pequenas, os nomes ficam empilhados com o ampersand menor. Texto de corpo deve permanecer legível no celular; labels pequenos e espaçados são apenas auxiliares, nunca a única forma de transmitir informação essencial.

## Assets e origem

public/monograma-vf.png: desenho original extraído da imagem enviada, com transparência. É raster PNG, não vetorização. Preserve proporção, evite distorção e repetição desnecessária. Se for solicitado um SVG genuíno, obtenha o original ou faça uma etapa de vetorização com revisão própria; mudar a extensão não cria um vetor.

public/rosas-botanicas.png: gravura Vintage roses, FreeSVG/OpenClipart ID74999, recolorida em sálvia e com transparência. A página declara CC0/domínio público. O download vetorial não forneceu conteúdo durante a obtenção; foi utilizada a prévia PNG. Origem em origem-botanica.md. Assets estão no próprio projeto; a renderização não depende de hotlink ao catálogo externo.

Referências de layout são inspiração, não licença para copiar templates ou suas imagens. Registre fonte, licença e adaptações para qualquer novo asset. Elementos puramente decorativos têm alt vazio e não interceptam clique.

## Composição por seção

| Área | Direção e comportamento |
|---|---|
| Cabeçalho | Monograma pequeno, navegação compacta e menu móvel em fluxo; aviso de demonstração enquanto necessário |
| Abertura | Convite central, monograma menor, nomes, frase breve, data/hora, local/cidade e ação de presença; rosas discretas nas bordas |
| História | Bloco central de leitura, sem painel grande repetindo monograma; texto/fotos pessoais somente após aprovação |
| Evento | Cerimônia e recepção com informações confirmadas e endereço marcado como pendente |
| Orientações | Perguntas em acordeão, conteúdo sem inventar políticas ainda indefinidas |
| Presentes | Catálogo ilustrativo; valores de exemplo e ações de pagamento desabilitadas |
| Presença | Acesso por código e link de demonstração; formulário por pessoa em rota própria |
| Rodapé | Assinatura do casal, data/cidade e retorno ao início |

A primeira tentativa com ramos SVG geométricos grandes, moldura dupla e painel de monograma foi rejeitada e não publicada. O refinamento substituiu esses elementos por gravura orgânica pequena, removeu a moldura e simplificou a história. Não reintroduza esse conjunto por reutilização de uma versão antiga.

## Arquivos responsáveis

src/pages/SaveTheDate.tsx compõe a página. src/features/casamento/conteudo.ts concentra fatos. Abertura.tsx, Cabecalho.tsx, NossaHistoria.tsx, Evento.tsx, Orientacoes.tsx e Rodape.tsx implementam as seções. Monograma.tsx e RamoBotanico.tsx apresentam os assets. src/features/presentes/ e src/features/presenca/ cuidam dos domínios correspondentes. src/index.css contém tokens e estilo editorial. index.html e public/site.webmanifest contêm identidade fora do corpo da página.

## Responsividade, acessibilidade e movimento

Aceite esperado: 320px sem rolagem horizontal; imagens carregadas e proporcionais; menu acessível; H1 único e H2 por seção; foco visível; teclado; alvos de toque de pelo menos 44px; contraste AA; campos rotulados e erros recuperáveis; âncoras sem títulos cobertos pelo cabeçalho. Overlay futuro deve usar Radix/createPortal quando necessário; o menu atual em fluxo não exige overlay.

Movimento é discreto e respeita prefers-reduced-motion. Conteúdo deve continuar visível sem execução de animações. Efeitos não podem ser condição para exibir nomes, data ou controles.

## Evidência e limites da revisão

O refinamento de 10/11/2026 passou TypeScript, lint e build (0 erros de lint, 7 warnings existentes). A validação CDP em larguras 320/390/1280 verificou ausência de overflow, nome, monograma, rosas carregadas e abertura do menu móvel. Houve inspeção de capturas locais desktop e celular.

Esses testes não constituem auditoria WCAG completa, teste em Safari/iOS real, aceite visual final ou validação de produção. Após cada alteração relevante, repetir as verificações, inspecionar telas reais e registrar o que foi efetivamente exercitado. Aprovação do CSS/JS por HTTP e hash comprova entrega de bytes, não estética.

## Mudanças futuras

Texto da história, fotos do casal, traje, endereço completo, mapa e demais políticas aguardam conteúdo aprovado. Preserve os dados conhecidos e a indicação de pendência até decisão. Mudanças de identidade devem ser apresentadas com arquivos exatos e plano para aprovação; referências novas precisam harmonizar com a paleta e o monograma, não substituí-los silenciosamente.
