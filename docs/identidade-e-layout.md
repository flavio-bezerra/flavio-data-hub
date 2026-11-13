# Identidade visual e layout — Victória & Flávio

## Estado e aprovação

Atualizado em 11/11/2026. **Jardim em aquarela é o design geral aprovado pelo casal**, com Sloop Script Three. O acabamento de legibilidade com superfícies brancas foi autorizado em seguida. A versão permanece local: aprovação de design não equivale a autorização de commit, push ou deploy. O aceite visual do acabamento e a inspeção em aparelho real permanecem necessários.

Este documento é a referência vigente. Herbário, Italianno, Aphrodite e as faixas repetidas de textura pertencem ao histórico, não ao padrão atual. O site é uma extensão da papelaria do casamento, não uma interface corporativa.

## Conceito e assinatura

Composição botânica romântica, clássica e artística: copos-de-leite como assinatura pessoal ligada ao buquê, orquídeas brancas e violetas azuis como apoio, folhagem sálvia/eucalipto, manchas de aquarela azul e verde com pigmento e bordas irregulares. Cada seção tem pintura própria, não uma textura repetida ou uma flor colada ao lado do conteúdo.

A pintura enquadra; o branco organiza; a caligrafia dá personalidade. Textos e controles são HTML real. As artes não contêm letras, datas, preços, botões ou fotografias do casal. O monograma original e as fotos reais são preservados.

## Grafia e dados

Use **Victória & Flávio**, com os acentos, em nomes visíveis, metadados e nomes acessíveis. Caminhos históricos e domínio podem conservar grafia técnica sem acento. Dados centralizados em src/features/casamento/conteudo.ts: domingo, 10 de outubro de 2027, às 13h30, DellaTorres Eventos, Mairiporã/SP; recepção no mesmo local. Não inventar endereço, traje, regras de crianças, prazo exato ou história pessoal.

## Paleta e contraste

| Cor/token | Valor | Papel no design |
|---|---|---|
| Branco de leitura | #FFFFFF | Boxes brancos opacos; abertura mobile sem fundos nos boxes |
| Papel / --papel | #FAF8F3 | Token de branco quente e fundos de apoio |
| Ardósia / --ardosia | #34506A | Nomes, títulos, controles e destaques |
| Névoa / --nevoa | #D3DFEA | Apoio e aviso de demonstração |
| Névoa clara | #E6EDF3 | Apoio suave |
| Eucalipto | #7E8F78 | Folhagens e decoração; não texto pequeno |
| Tinta / --tinta | #2F3F35 | Texto de leitura |
| Tinta suave | #4D5A49 | Apoio e elementos secundários |
| Linho | #E8DDCB | Referência de papelaria, não faixas obrigatórias |
| Marrom claro | #B59E80 | Bordas discretas das fotos e detalhes |
| Marrom de texto | #7A644A | Rótulos e avisos; não substituir por dourado |

As artes têm variação tonal própria, coerente com essa paleta. Não aplicar recoloração que tinja as flores brancas. Valores são referências digitais, não especificações de impressão.

**Regra vigente aprovada após finalizar o convite:** boxes retornam ao branco 100% opaco no desktop e nas demais seções mobile. Convite, data/local e ações da abertura mobile ficam sem fundos nos boxes (background-color: transparent). Conteúdo da abertura mobile elevado 1,5rem, compensando no padding inferior para manter a pintura na mesma posição. Preservar textos, botões, campos, imagens e descendentes opacos; a exceção altera somente o fundo dos boxes. A pintura variável exige conferência visual de contraste; esta escolha não comprova conformidade WCAG. As superfícies não têm bordas, cantos arredondados ou sombras de card de aplicativo. Respiro interno de 1,25 a 2rem; a pintura continua visível nas margens.

Ardósia e tinta sobre branco têm contraste amplo para leitura; a meta é WCAG AA. Não afirmar auditoria completa apenas porque os tokens passam contraste: sobreposições, estados e dispositivos ainda precisam ser avaliados.

## Tipografia

| Uso | Família/arquivo | Comportamento |
|---|---|---|
| Nomes, títulos e rodapé | Sloop Script Three — public/rebranding/sloop-three.ttf | Caligrafia clássica, peso real 400; floreios com respiro |
| Reserva caligráfica | Bickham — bickham-regular.ttf | Reserva local seguida de cursive |
| Corpo, datas e interface | EB Garamond Local — garamond-regular.ttf | Serifada de leitura seguida de Georgia/serif |
| Itálico real | garamond-italic.ttf | Citação e avisos sem itálico artificial |

Fontes locais, sem Google Fonts. Nomes grandes empilhados, ampersand menor; títulos fluidos com clamp. O CSS atual usa nomes entre aproximadamente 4,5 e 8rem e títulos entre 2,6 e 5,5rem conforme seção/viewport. Corpo permanece em fonte de leitura, nunca caligrafia. Rótulos em versaletes com espaçamento moderado são auxiliares, não a única fonte de informação essencial. Fonte menor não é solução para acomodar conteúdo: ajustar largura e fluxo.

Usuário informou não haver problema com licenças do acervo. Não houve auditoria documental independente. Manter essa distinção e evitar redistribuir a biblioteca inteira sem necessidade.

## Monograma e fotografias

public/monograma-vf.png é o V & F original, raster PNG com transparência. Preservar desenho e proporção, sem recriar por tipografia e sem alegar vetorização. Usado na navegação e rodapé; a repetição adicional na abertura está oculta no layout atual.

public/rebranding/casal-celebracao.webp e casal-juntos.webp são fotos reais pessoais, reduzidas e sem EXIF. Em 13/11/2026, casal-juntos.webp foi substituída por IMG_1630.HEIC, com orientação corrigida e recorte horizontal 1400 × 788 px preservando rostos e a pose de Flávio segurando Victória; original HEIC e foto anterior preservados. Mantidas por pedido do casal; não gerar substitutos representando as pessoas. Na história, molduras claras finas, sem inclinação de Polaroid; foto vertical 3:4 e foto horizontal sobreposta. Conferir o enquadramento dos rostos em alterações de tamanho.

## Composição por seção

| Seção/componente | Arte e layout | Proteção da leitura |
|---|---|---|
| Cabeçalho / Cabecalho.tsx | Monograma pequeno, navegação compacta, menu móvel em fluxo | Branco; aviso de demonstração distinto |
| Abertura / Abertura.tsx | abertura-pintura.webp: copos-de-leite à esquerda, folhagem suspensa à direita, branco central; nomes empilhados | Convite, data/local e ação com pequenas superfícies brancas; manter nomes como foco |
| Nossa história / NossaHistoria.tsx | historia-pintura.webp; fotos à esquerda, texto à direita | Coluna branca opaca para texto e citação; fotos permanecem sobre pintura |
| O nosso dia / Evento.tsx | programa-pintura.webp: orquídeas e violetas à esquerda; horários centro-direita | Folha branca para título, data, programa e informação de endereço |
| Para nossos convidados / Orientacoes.tsx | orientacoes-pintura.webp: violetas e folhagens nas margens | Cabeçalho e lista de definições sobre branco; perguntas sempre visíveis |
| Com carinho / Presentes.tsx | presentes-pintura.webp: orquídeas nas laterais | Folha branca para introdução, itens e valores; pagamento desabilitado |
| Esperamos você / ConviteDePresenca.tsx | presenca-pintura.webp: copos-de-leite completos e folhagens | Superfície branca para título, texto, avisos e formulário |
| Rodapé / Rodape.tsx | Branco, monograma original, nomes Sloop, data/cidade e retorno ao início | Branco limpo |

## Responsividade

Breakpoint principal: 860px. Desktop mantém a pintura de seção e conteúdo deslocado para as áreas claras. As pinturas de fundo atuais usam tamanho 100%/100% no desktop; verificar proporções ao mudar alturas e preferir reorganizar conteúdo a distorcer mais a arte.

No celular, as seis pinturas ganham variantes verticais em public/rebranding/mobile/: as seis artes foram recompostas em 780 × 1400 px com contorno orgânico em V aberto para cima: pintura nas laterais e branco descendo ao centro. Abertura aprovada pelo casal e aplicada também às outras cinco seções. Textura de aquarela preservada, sem desvanecimento artificial ou borda horizontal; arquivos WebP lossless. As novas composições reorganizam a botânica e não são simples recortes das artes desktop. Os fundos são dimensionados pela largura, sem ampliação pela altura do texto, recortes laterais ou banners separados. Conteúdo em coluna única sobre branco opaco (exceção na abertura mobile, sem fundos nos boxes); nomes empilhados, horários acima das descrições, formulário com botão de largura total. Fotos reais preservadas e sobrepostas. Desktop acima de 860px permanece intacto. Conferir composição em 320/390/430px além de overflow e funcionalidades; Safari e aparelho real exigem validação própria.

## Interação e acessibilidade

H1 único, H2 por seção, controles com nome acessível, campos rotulados, erros associados ao código, foco visível e alvos mínimos de 44px. Imagens puramente decorativas têm alt vazio/aria-hidden ou são fundos CSS; não interceptam clique. Navegação e âncoras devem preservar os títulos abaixo do cabeçalho. Menu atual em fluxo; overlays futuros usam Radix/createPortal quando necessários.

Respeitar prefers-reduced-motion. Texto permanece visível sem execução de animações; efeitos não condicionam nomes, datas ou controles. Evitar animações decorativas concorrentes com a pintura.

## Conteúdo funcional e privacidade

RSVP continua demonstrativo: código demonstracao abre /convite/demonstracao; dados fictícios e nenhum envio real de confirmação. Presentes são ilustrativos, sem pagamento. Não remover esses avisos para melhorar estética. Convites reais, famílias e credenciais não entram em Git nem no bundle público. Pendências factuais continuam explícitas até aprovação.

## Arquivos e manutenção

src/pages/SaveTheDate.tsx compõe as seções. src/index.css é a fonte dos tokens e estilos; nomes técnicos herbario-* permanecem por compatibilidade e não significam que Herbário continue vigente. Conteúdo factual em conteudo.ts; domínios presentes e presença em src/features/. Assets aprovados em public/rebranding/; documentação de origem em origem-botanica.md; acervo em acervo-e-evolucao-do-design.md; operação em desenvolvimento-hibrido.md e entrega-databricks.md.

O acervo inteiro ainda está em public/: Vite copia esses arquivos para dist mesmo sem uso. Antes de publicar, revisar separação de referências/originais, fotos, HEIC, ZIP e fontes, com autorização própria para mover arquivos. Esta etapa não moveu acervo nem alterou workflow.

## Validação, aceite e publicação

Antes do acabamento: TypeScript, lint e build aprovados, 0 erros e 7 avisos Fast Refresh preexistentes; Browserslist antigo. CDP 320/390/1280 aprovou ausência de overflow/imagens quebradas, carregamento de fontes, abertura do menu e código inválido/convite demonstrativo. Não constitui teste Safari/iOS, auditoria WCAG ou validação de produção.

Após acabamento (11/11/2026): TypeScript/lint/build aprovados (exit 0, 0 erros/7 avisos existentes). CDP 320/390/1280 aprovado: sem overflow ou imagens quebradas, Sloop/EB Garamond carregadas, menu expandido, erro de código e abertura da demonstração funcionais, sem exceções JavaScript. Captura desktop inspecionada: superfícies brancas opacas presentes e pinturas mantidas nas margens. Teste de aparelho real/Safari e aceite visual do acabamento ainda pendentes. Design geral aprovado; acabamento autorizado e sujeito a conferência visual. Commit/push/publicação ainda não autorizados nesta etapa. Push na main dispara FTP automaticamente: exigir autorização de entrega e conferir resultado antes de afirmar publicação.

## Histórico resumido

Herbário com pranchas antigas e Italianno foi a direção anterior. Primeira tentativa de Jardim com faixas repetidas e flores soltas foi rejeitada por distância da referência. Correção adotou seis pinturas próprias sem texto embutido, molduras sem inclinação e fontes locais. Aphrodite foi experimentada e substituída por Sloop a pedido do casal. Recorte cortado do copo-de-leite saiu do cartão, substituído por composição completa. Em seguida, casal aprovou design geral e pediu acabamento de legibilidade. Não reintroduzir decisões históricas como regras atuais.


### Correção mobile — 11/11/2026

Versão mobile anterior rejeitada pelo casal após publicação: flores cortadas, pinturas isoladas como banners e programa apertado. Correção local autorizada, seis recomposições das artes aprovadas (sem geração de pessoas), CSS restrito ao breakpoint de 860px. TypeScript, lint e build aprovados (0 erros/7 avisos existentes). Após suavizar bordas das pinturas, CDP 320/390/430/1280 passou: fontes, menu, erro de código e demonstração; sem overflow, imagens quebradas ou exceções JS. Captura final 390px inspecionada: flores completas na abertura, fundos integrados sem banners, horários empilhados e botão de formulário inteiro. O build aprovado antecede apenas o refinamento dos WebP, sem mudanças posteriores de CSS ou TypeScript. Aceite do casal e teste em aparelho real/Safari pendentes; sem commit/push/publicação nesta etapa.


### Textura mobile — 13/11/2026

Refeitas localmente as seis pinturas mobile a partir das artes desktop aprovadas, removendo o desvanecimento de 120 px e a aguada superior artificial. Dimensões e posição da arte preservadas; CSS, textos, desktop e demais assets intactos. Backup em .local. Comparação das seis imagens gerada; aceite visual antes de commit/push.


### V aberto mobile — 13/11/2026

Aplicadas seis novas artes locais, aprovadas visualmente pelo casal. Pinturas aprovadas; alteração posterior autorizada somente para micro-recorte da abertura mobile: 38 px à esquerda e 42 px da base no total (aproximadamente 5% e 3% da arte original), resultando em 742 × 1358 px; segundo incremento de 15 px à esquerda e 14 px na base sem redimensionamento do arquivo. Altura mínima CSS ajustada à nova proporção. Demais cinco artes intactas; comparação local antes/depois disponível em .local. Na abertura mobile, nomes/data compactados e local/cidade em linhas separadas para ocupar o branco central do V. Altura mínima acompanha a proporção da pintura, preservando espaço inferior. Link Responder ao convite retirado da abertura em todas as telas; acesso à presença permanece no menu e na seção própria. Desktop conserva a disposição das informações. TypeScript/lint/build e CDP 320/390/430/1280 aprovados (7 warnings existentes). Backup em .local. Teste em aparelho real pendente; aplicação local não implica publicação.
