# Acervo criativo e evolução do design — Victória & Flávio

Data da avaliação: 11/11/2026. Base local: commit `c82cfe80e7c80fa4daed36927ba1abe98f02fb08`.

**Status:** documento de avaliação e proposta. Não aprova troca de identidade, uso de todos os arquivos, publicação de fotos ou instalação de ferramentas. Nenhum frontend foi alterado nesta avaliação. Incorporação documental autorizada e realizada localmente em 11/11/2026. O casal pretende iniciar o rebranding em seguida; escolhas visuais e implementação serão objeto de plano próprio.

## 1. Leitura geral

A contribuição recente não é apenas uma nova versão da página: ela cria uma biblioteca de exploração visual e um conjunto de métodos de trabalho. Fontes, fotos pessoais, ilustrações e superfícies podem tirar o site do universo de template e aproximá-lo de uma papelaria autoral do casal.

O principal ganho das fotos é trazer identidade humana, algo que nenhuma flor ou efeito substitui. O ganho das fontes é permitir uma seleção mais refinada de caligrafia e tipografia editorial. Flores e texturas oferecem novas formas de composição, mas precisam de curadoria: quantidade de arquivos não equivale a coerência visual.

A recomendação é evoluir de **Herbário** para um **álbum botânico pessoal**, como hipótese a prototipar, não como decisão já aprovada. Preservar abertura em papel branco, nomes desenhados e copo-de-leite; introduzir momentos fotográficos na história; usar a botânica como fio condutor e as texturas como material de apoio discreto.

## 2. Inventário verificado

Contagem física dos arquivos nesta inspeção; tamanhos arredondados em MB decimais. Pastas de famílias não equivalem necessariamente a famílias tipográficas distintas: algumas agrupam variantes ou coleções.

| Acervo | Caminho no repositório | Quantidade | Formatos e tamanho | Situação |
|---|---|---:|---|---|
| Ilustrações e composições botânicas | `public/flores/` | 36 arquivos | 32 JPG + 4 PNG; 8,9 MB | Referências novas, sem uso desses caminhos encontrado nos componentes pesquisados |
| Fotos pessoais | `public/fotos/` | 19 arquivos | 5 JPG + 13 HEIC + 1 PNG; 27,5 MB | Disponíveis para seleção; não confundir upload com escolha editorial final |
| Texturas e composições gráficas | `public/texturas/` | 33 arquivos | 27 JPG + 6 PNG; 18,0 MB | Mistura de materiais, imagens gráficas e motivos botânicos |
| Fontes extraídas | `public/fonts/family/` | 46 pastas; 239 arquivos | 131 TTF + 108 OTF; 47,8 MB | Biblioteca de experimentação; licenças web ainda não auditadas |
| Pacotes de fontes | `public/fonts/zips/` | 53 arquivos | ZIP; 24,7 MB | Arquivos-fonte de acervo, não necessários à renderização |
| Skills locais | `.agent-skills/` | 37 pastas com `SKILL.md` | Instruções e referências | Leitura disponível; integração automática com cada agente não validada |

Essas cinco pastas de assets somam aproximadamente **126,4 MB**. Isso é tamanho de acervo, não peso de download inicial da página.

O arquivo `public/fonts/fontes-family-list.txt` declara 228 arquivos; a contagem física encontrou 239 TTF/OTF. O README das skills declara 36; o README raiz e a contagem física apontam 37. Esses números devem ser alinhados quando a documentação for incorporada.

## 3. Fontes: biblioteca para escolher, não para carregar inteira

Entre as pastas disponíveis estão Evafiya, Pinyon Script, Bickham Script Pro, Aphrodite Slim Pro, Sloop, Aston Script Pro, Adobe Garamond Pro, EB Garamond, Baskervville, Libre Baskerville, Didot, Libre Bodoni, Canela, Spectral e Fraunces.

A identificação acima usa nomes de pastas e catálogo local. Não comprova autenticidade, licença, caracteres suportados ou qualidade de renderização de cada arquivo.

| Papel tipográfico | Direção de seleção | Verificação necessária |
|---|---|---|
| Nomes Victória & Flávio | Uma caligrafia clássica, fina e legível | Testar palavras reais, acentos, ampersand, ascendentes e cortes no celular; conferir licença |
| Títulos e data | Uma serifada editorial complementar | Avaliar hierarquia e convivência com a caligrafia; evitar disputa entre ornamentos |
| Corpo e formulários | Newsreader atual ou outra serifada de leitura selecionada | Leitura em tela pequena, contraste, pesos reais e altura de linha |

Três papéis não exigem três novas famílias. A biblioteca amplia as alternativas; o site final deve carregar poucas fontes e poucos pesos.

**Pendência técnica confirmada:** `src/index.css` declara Evafiya por `/fonts/Evafiya.ttf`, mas a fonte está organizada em `public/fonts/family/Evafiya/Evafiya.ttf`. O build avisa que a referência não foi resolvida. Os seletores principais de nomes, títulos e rodapé ainda declaram Italianno: a presença do `@font-face` não comprova adoção efetiva da Evafiya nesses elementos.

Antes de publicar qualquer fonte nova, registrar licença e permissão de incorporação web. O catálogo contém nomes com indicadores como `Trial` e `Personal`, além de fontes comerciais: sua presença no Git não demonstra autorização de uso. Converter TTF/OTF em WOFF2 só quando permitido pela licença. A Sweet Fancy Script continua pendente; não foi licenciada nesta avaliação.

## 4. Fotos: a principal oportunidade de personalização

Foram identificadas 19 fotos, das quais 13 estão em HEIC. Os JPG/PNG inspecionados por metadados incluem retratos verticais e imagens horizontais, com dimensões de 1280 × 853 até 3664 × 2062. Não foi realizada curadoria visual completa do conjunto nem decodificação dos HEIC nesta rodada.

Recomenda-se selecionar uma foto principal para a história e poucas fotos complementares com relação narrativa real. Evitar uma galeria apenas para preencher espaço e evitar fotos de banco quando já existem imagens do casal.

Preparação proposta: converter HEIC para formato compatível com a web, respeitar orientação, revisar recortes de rostos e enquadramento, exportar tamanhos responsivos em WebP/AVIF conforme a ferramenta disponível e remover metadados desnecessários, especialmente localização. Manter originais fora da pasta publicada. Texto alternativo deve descrever fotos relevantes; flores e texturas puramente decorativas podem continuar com `alt` vazio.

## 5. Flores: novas possibilidades de composição

A amostra visual inspecionada inclui uma samambaia em aquarela (`flor-001.jpg`) e uma composição de copos-de-leite nos cantos com centro livre (`flor-023.png`). A primeira serve como ilustração isolada; a segunda é uma referência de layout, não apenas uma planta recortada. Essa distinção deve orientar a catalogação.

A composição de copos-de-leite é uma referência especialmente próxima do pedido do casal: branco, verde e espaço de respiro. Pode inspirar um cartão interno ou uma composição lateral. A abertura precisa continuar focal, sem voltar às molduras pesadas ou ramos gigantes rejeitados.

**Transparência verificada:** os quatro PNG de `public/flores/` têm canal RGBA, mas seu alpha é 255 em todos os pixels. Portanto, são inteiramente opacos. Os JPG não têm transparência. Os novos arquivos não estão prontos para sobreposição como recortes transparentes; isso não altera a transparência dos WebP antigos já usados pelo site.

Manter a regra aprovada: flores sobre papel branco, sem raízes, bulbos ou legendas indesejadas. Separar referências completas de recortes finais e registrar origem/licença antes de incorporar. Não atribuir domínio público às novas imagens com base na licença das pranchas antigas.

## 6. Texturas: material, não cenário concorrente

As amostras inspecionadas mostram tanto superfície com formas verdes amplas (`textura-001.jpg`) quanto um motivo de folhas em fita sobre branco (`textura-024.png`). Logo, a pasta não contém apenas granulação de papel: também contém composições gráficas completas.

Classificar os arquivos em papel/grão, tecido/linho, superfícies coloridas e ornamentos/composições. Uma composição gráfica não deve ser aplicada indiscriminadamente como textura de fundo.

Recomenda-se testar uma ou duas superfícies discretas, preservando texto legível e branco limpo sob as flores e no rodapé. Evitar estampas fortes sob nomes, data e campos de formulário. Qualquer mudança na abertura lisa aprovada requer comparação visual e novo aceite.

Os seis PNG de `public/texturas/` também são inteiramente opacos na inspeção do alpha. Extensão PNG não significa fundo transparente.

## 7. Skills: curadoria de métodos de trabalho

Foram lidos nesta avaliação os arquivos locais de `better-typography`, `redesign-existing-projects` e `design-and-refine`, além dos catálogos. A avaliação também usou a skill disponível de frontend design. Não foram executadas as 37 skills nem instalados plugins.

| Etapa | Skills locais prioritárias | Contribuição |
|---|---|---|
| Diagnóstico e direção | `frontend-design`, `redesign-existing-projects` | Separar problemas estruturais de decoração; preservar a stack existente |
| Comparação de propostas | `design-and-refine`, `prototype` | Criar alternativas realmente diferentes e recolher feedback antes de consolidar |
| Tipografia | `better-typography` | Formatos web, escala, medidas de linha, OpenType, acentos, pesos e leitura |
| Cor | `better-colors` | Revisar contraste e consistência dos tokens sem substituir a paleta aprovada |
| Texto pessoal | `copywriting` | História e instruções específicas do casamento, evitando voz comercial |
| Acabamento e movimento | `better-ui`, `design-motion-principles` | Ajustes ópticos e movimento discreto, depois de layout e conteúdo |
| Verificação | `alt-text`, `playwright`, `stitched-full-page-capture`, `optimize-web-animations` | Imagens acessíveis, capturas confiáveis, interação e custo de animação |

Skills são orientação, não autoridade para mudar o produto. Algumas sugerem estética SaaS, bento grids, glassmorphism, GSAP, fundos com gradientes ou Netlify; essas escolhas não decorrem do pedido do casal. Adaptar princípios úteis ao convite clássico, sem importar todo o estilo.

O projeto permanece Tailwind 3 e HostGator/FTP. Referências a Tailwind 4 ou Netlify não autorizam migração. Copiar um `SKILL.md` permite leitura, mas não garante descoberta automática pelo agente, ferramentas, plugins ou credenciais. Os comandos de integração documentados precisam de validação para cada ambiente antes de serem apresentados como comprovados.

## 8. Acervo versus publicação: risco prioritário

Vite copia o conteúdo de `public/` para `dist/`, mesmo quando não há referência no React. O workflow publica `dist/` por FTP e não exclui essas pastas de referência.

Isso cria duas questões distintas: arquivos sem uso não precisam ser baixados na primeira abertura da página, mas ainda podem ficar publicamente disponíveis por URL e aumentar o tamanho da entrega. Fotos originais, HEIC, ZIP de fontes e arquivos Trial/Personal não deveriam ir ao servidor automaticamente só por estarem no acervo.

Recomenda-se separar referências/originais de assets aprovados para publicação. Remover um arquivo de `public/` em uma entrega futura não comprova, por si só, que uma cópia já enviada deixou de existir no servidor: verificar a remoção remota e as regras do deploy. Não alterar ou apagar arquivos nesta etapa sem autorização.

## 9. Divergências documentais a resolver

`docs/identidade-e-layout.md` e `AGENTS.md` continuam descrevendo o sistema publicado de Italianno/Cormorant/Newsreader. A nova biblioteca é uma oportunidade, não uma escolha tipográfica consolidada. O catálogo `docs/skills-reference.md` apresenta uma escala de tokens como já definida, mas a busca no CSS não encontrou o token `color-blue-50`; não tratar os valores do exemplo como implementação comprovada.

Também distinguir a regra vigente de abertura lisa da sugestão genérica de adicionar texturas. Material novo não cancela decisões anteriores. Corrigir contagens e documentar sugestões como hipóteses, não como melhorias já implementadas.

## 10. Roteiro recomendado

| Prioridade | Trabalho | Resultado esperado |
|---|---|---|
| 1 | Curadoria e proteção do acervo | Separar referências de produção; verificar direitos, exposição de originais e formatos |
| 2 | Seleção de fotos e fontes | Pequena shortlist com critérios e amostras dos nomes reais |
| 3 | Comparação visual local | Duas ou três propostas de abertura/história usando o mesmo conteúdo, para aprovação |
| 4 | Consolidação da identidade | Escolher uma composição e atualizar tokens/documentação sem proliferar estilos |
| 5 | Preparação web e verificação | Recortes transparentes, imagens responsivas, fontes licenciadas, teclado, mobile e performance |
| 6 | Entrega autorizada | Commit/push e deploy somente após autorização específica |

Não é necessário introduzir um laboratório de rotas, novas dependências ou animações complexas apenas para produzir este overview. A implementação futura será apresentada em plano separado com os arquivos exatos.

## 11. Limites e evidências

Esta avaliação realizou inventário físico, leitura dos documentos e de três skills locais, busca de referências no CSS/TSX, inspeção visual de quatro imagens e leitura de dimensões dos JPG/PNG de fotos e alpha dos PNG novos. Não é uma curadoria visual de todas as fotos/flores/texturas, auditoria de todas as licenças, teste de integração dos agentes ou avaliação visual completa da página no navegador.

A validação anterior desta base passou TypeScript, lint (0 erros e 7 avisos existentes) e build; ficou o aviso de referência Evafiya não resolvida e de Browserslist antigo. Uma instalação limpa das novas dependências ainda não foi validada. Nenhum desses resultados equivale a aprovação de fontes/fotos para publicação.

## 12. Incorporação documental realizada

Overview incorporado em `docs/acervo-e-evolucao-do-design.md`, com link na tabela documental do `README.md`. `docs/identidade-e-layout.md` referencia o acervo e distingue identidade vigente de alternativas em estudo. `.agent-skills/README.md` teve a contagem corrigida de 36 para 37, sem reescrever ou alterar as skills.

Escopo documental apenas. Sem alteração de frontend, correção de fonte, movimentação de assets, instalação, commit, push ou deploy nesta etapa.
