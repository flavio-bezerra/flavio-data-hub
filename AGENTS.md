# Victória & Flávio — orientações do projeto

Leia docs/estrutura-e-regras.md e os guias em agents/ antes de trabalhar.

## Fluxo de trabalho
Inspecione os arquivos necessários e apresente um plano com caminhos exatos. Aguarde autorização textual antes de editar. Preserve mudanças de outras pessoas. Valide build, TypeScript, lint e experiência móvel antes da entrega. Registre separadamente verificações aprovadas, falhas existentes e pendências.

## Organização
Use React/TypeScript/Vite e organização por domínio em src/features/. Cada componente tem seu próprio arquivo. Centralize fatos do casamento em src/features/casamento/conteudo.ts. Use componentes shadcn existentes e tokens semânticos de Tailwind. Mantenha o código legado separado até uma limpeza autorizada.

## Produto
A identidade é a do convite clássico de Victória & Flávio, não uma identidade corporativa. Preserve Cormorant Garamond, Montserrat e detalhes champagne. Dados confirmados: 10/10/2027, 14h, DellaTorres Eventos, Mairiporã/SP, recepção no mesmo local.

## Dados e ambientes
Desenvolva com convidados fictícios. Identifique claramente demonstrações, pagamentos desabilitados e conteúdo pendente. Dados reais de famílias e credenciais ficam no backend, fora do bundle público e do Git. Produção exige autorização por convite no servidor e pagamento confirmado pelo provedor.

## Publicação
Leia agents/publicacao.md. O workflow de FTP publica automaticamente após push na main e mantém workflow_dispatch. Cada push autorizado na main é também autorização de publicação da versão enviada. Entregue o projeto completo via bundle isolado e prepare a pasta Git com notebooks/preparar-pasta-git.py; use acao=publicar_git no notebook para commit/push autorizado, em serverless ambiente 5+, com credenciais gerenciadas pelo Databricks. Leia docs/entrega-databricks.md. A aprovação visual e os testes locais antecedem a publicação na HostGator. Registre separadamente upload do bundle, aplicação na pasta Git e push confirmado.

## Identidade aprovada — 10/11/2026
Grafia: Victória & Flávio. Paleta sálvia/eucalipto, azul acinzentado/névoa e marfim; verde profundo para contraste. Cormorant Garamond e Montserrat preservadas. Monograma original extraído da imagem em PNG transparente: preservar desenho, não alegar vetorização. Gravura botânica CC0 em PNG substitui os ramos geométricos rejeitados; fonte e licença em docs/origem-botanica.md. Usar decoração orgânica pequena, sem moldura dupla ou painel grande repetindo monograma. Refinamento clássico, leve e elegante; publicação direta autorizada após testes.
