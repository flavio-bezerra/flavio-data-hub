# Victória & Flávio — orientações do projeto

Leia docs/estrutura-e-regras.md, docs/desenvolvimento-hibrido.md, docs/identidade-e-layout.md e os guias em agents/ antes de trabalhar.

## Fluxo de trabalho
Inspecione os arquivos necessários e apresente um plano com caminhos exatos. Aguarde autorização textual antes de editar. Preserve mudanças de outras pessoas. Valide build, TypeScript, lint e experiência móvel antes da entrega. Registre separadamente verificações aprovadas, falhas existentes e pendências.

## Organização
Use React/TypeScript/Vite e organização por domínio em src/features/. Cada componente tem seu próprio arquivo. Centralize fatos do casamento em src/features/casamento/conteudo.ts. Use componentes shadcn existentes e tokens semânticos de Tailwind. O portfólio foi removido por autorização; a cópia .local/legado-portfolio é local e ignorada.

## Produto
A identidade é a do convite clássico de Victória & Flávio, não uma identidade corporativa. Preserve Jardim em aquarela aprovado, Sloop Script Three + EB Garamond local, monograma original/fotos reais e paleta azul (névoa/ardósia), verde (eucalipto/tinta), branco papel e marrom claro (linho) conforme docs/identidade-e-layout.md. Dados confirmados: 10/10/2027, 13h30 (alterado de 14h em 10/11/2026), DellaTorres Eventos, Mairiporã/SP, recepção no mesmo local.

## Dados e ambientes
Desenvolva com convidados fictícios. Identifique claramente demonstrações, pagamentos desabilitados e conteúdo pendente. Dados reais de famílias e credenciais ficam no backend, fora do bundle público e do Git. Produção exige autorização por convite no servidor e pagamento confirmado pelo provedor.

## Publicação
Leia agents/publicacao.md. O workflow de FTP publica automaticamente após push na main e mantém workflow_dispatch. Cada push autorizado na main é também autorização de publicação da versão enviada. Use Git direto quando permitido no ambiente; Databricks é a alternativa validada para ambientes restritos. Nessa alternativa, entregue o projeto completo via bundle isolado e prepare a pasta Git com notebooks/preparar-pasta-git.py; use acao=publicar_git no notebook para commit/push autorizado, em serverless ambiente 5+, com credenciais gerenciadas pelo Databricks. Leia docs/entrega-databricks.md. A aprovação visual e os testes locais antecedem a publicação na HostGator. Registre separadamente upload do bundle, aplicação na pasta Git e push confirmado.

## Identidade vigente — 11/11/2026
Jardim em aquarela aprovado: seis pinturas próprias, copos-de-leite, orquídeas/violetas, azul/verde nas margens e boxes brancos 100% opacos; abertura mobile sem fundos nos pequenos boxes, conteúdo e controles opacos. Texto da abertura mobile elevado sem deslocar a pintura (refino posterior ao convite aprovado). Sloop Script Three nos nomes/títulos/rodapé, EB Garamond local no corpo/data. V & F original preservado em PNG; fotos reais mantidas. Informação prática e controles ficam sobre branco, sem cards de aplicativo. Leia docs/identidade-e-layout.md (manual consolidado) e docs/origem-botanica.md. Herbário, Italianno, Aphrodite e faixas repetidas são históricos, não instruções vigentes. Licenças informadas pelo usuário, sem auditoria independente. Design aprovado não autoriza push/deploy: esta entrega de acabamento é local e precisa conferência visual. Acervo em public ainda requer revisão antes de publicação, sem mover arquivos automaticamente.
