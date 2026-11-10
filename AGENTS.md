# Victória & Flávio — orientações do projeto

Leia docs/estrutura-e-regras.md, docs/desenvolvimento-hibrido.md, docs/identidade-e-layout.md e os guias em agents/ antes de trabalhar.

## Fluxo de trabalho
Inspecione os arquivos necessários e apresente um plano com caminhos exatos. Aguarde autorização textual antes de editar. Preserve mudanças de outras pessoas. Valide build, TypeScript, lint e experiência móvel antes da entrega. Registre separadamente verificações aprovadas, falhas existentes e pendências.

## Organização
Use React/TypeScript/Vite e organização por domínio em src/features/. Cada componente tem seu próprio arquivo. Centralize fatos do casamento em src/features/casamento/conteudo.ts. Use componentes shadcn existentes e tokens semânticos de Tailwind. O portfólio foi removido por autorização; a cópia .local/legado-portfolio é local e ignorada.

## Produto
A identidade é a do convite clássico de Victória & Flávio, não uma identidade corporativa. Preserve a direção Herbário (pranchas botânicas antigas de copo-de-leite, orquídea e violeta), Italianno + Cormorant Garamond + Newsreader, monograma e paleta azul (névoa/ardósia), verde (eucalipto/tinta), branco papel e marrom claro (linho) conforme docs/identidade-e-layout.md. Dados confirmados: 10/10/2027, 13h30 (alterado de 14h em 10/11/2026), DellaTorres Eventos, Mairiporã/SP, recepção no mesmo local.

## Dados e ambientes
Desenvolva com convidados fictícios. Identifique claramente demonstrações, pagamentos desabilitados e conteúdo pendente. Dados reais de famílias e credenciais ficam no backend, fora do bundle público e do Git. Produção exige autorização por convite no servidor e pagamento confirmado pelo provedor.

## Publicação
Leia agents/publicacao.md. O workflow de FTP publica automaticamente após push na main e mantém workflow_dispatch. Cada push autorizado na main é também autorização de publicação da versão enviada. Use Git direto quando permitido no ambiente; Databricks é a alternativa validada para ambientes restritos. Nessa alternativa, entregue o projeto completo via bundle isolado e prepare a pasta Git com notebooks/preparar-pasta-git.py; use acao=publicar_git no notebook para commit/push autorizado, em serverless ambiente 5+, com credenciais gerenciadas pelo Databricks. Leia docs/entrega-databricks.md. A aprovação visual e os testes locais antecedem a publicação na HostGator. Registre separadamente upload do bundle, aplicação na pasta Git e push confirmado.

## Identidade aprovada — 10/11/2026
Grafia: Victória & Flávio. Paleta azul névoa/ardósia, verde eucalipto/tinta, branco papel e marrom claro/linho (variáveis em src/index.css). Italianno nos nomes do casal e títulos de seção, Cormorant Garamond em data/horários/valores e Newsreader no corpo (Montserrat e Great Vibes removidas). Sweet Fancy Script foi pedida, mas é paga (MVB/Adobe Fonts): só usar com licença web válida. Seções como peças de papelaria: etiqueta, programa, coluna de livro, notas, cardápio e cartão-resposta. Monograma original extraído da imagem em PNG transparente: preservar desenho, não alegar vetorização. Flores: pranchas de domínio público em WebP com fundo transparente, uma por seção e sempre sobre papel branco; fonte, licença e edições em docs/origem-botanica.md. Sem moldura dupla, painel grande repetindo monograma, névoa azul atrás de pranchas ou fios dourados na data. Refinamento clássico, leve e elegante. Obtenha autorização para cada nova entrega. Leia docs/desenvolvimento-hibrido.md para conciliar contribuições de outras máquinas antes de editar ou empacotar.
