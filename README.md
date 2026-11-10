# Victoria & Flávio — site de casamento

Projeto React 18 + TypeScript + Vite 7 + Tailwind 3 + shadcn. O repositório Git conserva o nome histórico flavio-data-hub.

## Desenvolvimento local
Use Node 22.12+ compatível com Vite 7. Instale as dependências com npm ci e inicie npm run dev -- --host 127.0.0.1. Antes da entrega execute npm run build, npm run lint e npx tsc --noEmit -p tsconfig.app.json.

Para visualizar, execute visualizar-site.bat: abre http://127.0.0.1:8080. Na primeira instalação corporativa, o script exporta certificados TLS confiáveis do Windows para .local/ e usa npm ci pelo Artifactory corporativo com cafile absoluto e strict-ssl=true, sem alterar configuração global ou lockfile. Python é necessário nessa primeira instalação. O launcher Python antigo de Databricks conflita com o PATH: use "C:\Program Files\Databricks\databricks.exe".

## Experiência atual
A página / contém abertura, história, evento, orientações, presentes e presença. /convite/demonstracao permite testar resposta individual de duas pessoas fictícias. A demonstração não envia dados e se perde ao recarregar. Presentes e valores são ilustrativos, sem cobrança. Fotos, história, traje, endereço completo e prazo exato aguardam aprovação.

## Estrutura
src/features/casamento/ contém conteúdo e seções. src/features/presentes/ contém a prévia do catálogo. src/features/presenca/ contém acesso e confirmação por convite. O código de portfólio foi removido; este projeto é exclusivamente o site de casamento. Uma cópia local dos componentes antigos fica em .local/legado-portfolio, fora do Git, bundle e publicação.

## Trabalho com agentes
Leia AGENTS.md, agents/ux.md, agents/regras-de-negocio.md e agents/publicacao.md. O escopo, requisitos e critérios de aceite estão em docs/estrutura-e-regras.md.

## Publicação
O workflow .github/workflows/deploy.yml instala com npm ci, exige TypeScript, lint e build aprovados e publica dist/ via FTP na HostGator somente por acionamento manual no GitHub Actions. A prévia autorizada mantém presentes e RSVP claramente em demonstração; não registra confirmações nem processa pagamentos.

Fluxo: local -> pacote com manifesto -> bundle dev -> notebook de preparação da pasta Git -> commit/push pelo notebook (publicar_git, serverless ambiente 5+) -> publicação manual no GitHub Actions. Consulte docs/entrega-databricks.md. O bundle não cria jobs nem compute; bundle sync envia os arquivos. O notebook precisa de runtime com arquivos de workspace e Git CLI na pasta Git. Upload não comprova push.

## Próxima etapa
Aprovar visual e conteúdo; definir backend de presença e administração; integrar checkout e webhook com provedor escolhido; concluir testes e autorizar publicação do frontend.
