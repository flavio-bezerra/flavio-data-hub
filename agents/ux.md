# Revisão de UX e acessibilidade

Leia docs/identidade-e-layout.md para composição, paleta, assets e critérios. Use docs/estrutura-e-regras.md para fatos e pendências. Este guia é um resumo operacional.

Priorize o convidado no celular: nomes, data, local e ação de presença devem ser fáceis de encontrar. Use página principal por seções, navegação compacta e formulário separado por convite. Preserve o tom acolhedor e a estética do convite.

Use hierarquia H1 única e H2 por seção, campos com rótulos, mensagens de erro associadas, foco visível, contraste AA e alvos de toque de pelo menos 44px. Garanta navegação por teclado, reflow a 320px e movimento reduzido. Portale overlays por Radix/createPortal quando necessários. Prefira menus em fluxo quando dispensam overlay.

A história deve usar texto e fotos aprovados pelo casal; durante o protótipo, mostre conteúdo pendente em vez de uma história fictícia. Orientações de traje, transporte e crianças dependem de aprovação. Distinga pagamento real de demonstração e mostre feedback de presença sem sugerir gravação no servidor.

Valide: desktop/celular, menu, âncoras sem título oculto, convite inválido, resposta parcial, resposta completa e recuperação após erro. Documente o que foi verificado automaticamente e o que precisa de teste humano.

## Identidade aprovada — 10/11/2026
Grafia: Victória & Flávio. Direção Herbário: pranchas botânicas antigas (copo-de-leite na abertura e na presença, violeta na história e orientações, orquídea no programa e presentes) como protagonistas e seções como peças de papelaria. Flores com fundo transparente, sempre sobre papel branco. Paleta azul névoa/ardósia, verde eucalipto/tinta, branco papel e marrom claro/linho, com ardósia no botão principal. Italianno nos nomes e títulos de seção, Cormorant Garamond em datas e valores, Newsreader no corpo. Sweet Fancy Script só com licença web. Rodapé em branco papel. Monograma original extraído da imagem em PNG transparente: preservar desenho, não alegar vetorização. Origem e licença das pranchas em docs/origem-botanica.md. Abertura compacta, sem moldura dupla nem painel grande repetindo monograma. Refinamento clássico, leve e elegante; sem névoa azul atrás de pranchas e sem fios dourados na data. Publicação exige autorização por entrega. Separe direção aprovada de aceite visual final. Registre limites de testes automatizados: ausência de overflow não constitui auditoria WCAG ou teste Safari/iOS.
