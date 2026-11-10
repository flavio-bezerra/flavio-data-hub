# Victória & Flávio — site de casamento

Projeto React 18 + TypeScript + Vite 7 + Tailwind 3 + shadcn. O repositório Git conserva o nome histórico flavio-data-hub.

## Desenvolvimento local
Use Node 22.12+ compatível com Vite 7. Instale as dependências com npm ci e inicie npm run dev -- --host 127.0.0.1. Antes da entrega execute npm run build, npm run lint e npx tsc --noEmit -p tsconfig.app.json.

Para visualizar na Kinea, execute visualizar-site-kinea.bat; na máquina pessoal, visualizar-site-pessoal.bat. Ambos abrem http://127.0.0.1:8080 e usam a própria pasta do projeto, independentemente do caminho do clone. visualizar-site.bat permanece como atalho para Kinea. Recomendado Node 24 LTS; Ctrl+C encerra. Instalam com npm ci quando Vite não está instalado; após atualizar package-lock.json, reinstale as dependências com npm ci usando o registry do seu ambiente. Na máquina pessoal a instalação usa registry.npmjs.org com TLS ativo, sem Python ou Artifactory; use um clone separado e não copie node_modules ou .local entre máquinas. Na primeira instalação corporativa, o script exporta certificados TLS confiáveis do Windows para .local/ e usa npm ci pelo Artifactory corporativo com cafile absoluto e strict-ssl=true, sem alterar configuração global ou lockfile. Python é necessário nessa primeira instalação. O launcher Python antigo de Databricks conflita com o PATH: use "C:\Program Files\Databricks\databricks.exe".

## Experiência atual
A página / contém abertura, história, evento, orientações, presentes e presença. /convite/demonstracao permite testar resposta individual de duas pessoas fictícias. A demonstração não envia dados e se perde ao recarregar. Presentes e valores são ilustrativos, sem cobrança. Fotos, história, traje, endereço completo e prazo exato aguardam aprovação.

## Estrutura
src/features/casamento/ contém conteúdo e seções. src/features/presentes/ contém a prévia do catálogo. src/features/presenca/ contém acesso e confirmação por convite. O código de portfólio foi removido; este projeto é exclusivamente o site de casamento. Uma cópia local dos componentes antigos fica em .local/legado-portfolio, fora do Git, bundle e publicação.

## Documentação e continuidade

O desenvolvimento é híbrido: clones independentes em computadores Kinea/pessoal, com limitações diferentes de rede e ferramentas, convergem no GitHub. Databricks é a rota alternativa de commit/push para o ambiente restrito, não requisito de todo computador. Antes de outra entrega, incorpore contribuições remotas preservando o trabalho local.

| Documento | Uso |
|---|---|
| [Desenvolvimento híbrido](docs/desenvolvimento-hibrido.md) | Ambientes, comandos, limitações, troca de máquina e passagem de trabalho |
| [Identidade e layout](docs/identidade-e-layout.md) | Paleta, tipografia, monograma, botânica e critérios visuais |
| [Estrutura e regras](docs/estrutura-e-regras.md) | Arquitetura, requisitos, demonstração e decisões pendentes |
| [Entrega Databricks](docs/entrega-databricks.md) | Transporte, aplicação, publicação e recuperação |
| [Origem botânica](docs/origem-botanica.md) | Fonte, licença e formato dos assets |

Agentes devem começar por AGENTS.md e pelos guias agents/ux.md, agents/regras-de-negocio.md e agents/publicacao.md.

## Publicação
O workflow .github/workflows/deploy.yml instala com npm ci, exige TypeScript, lint e build aprovados e publica dist/ via FTP na HostGator automaticamente após push na main, mantendo acionamento manual no GitHub Actions. Após FTP, scripts/verificar-publicacao.mjs confere HTML e status/MIME/hashes de JS/CSS; falha nessa etapa não desfaz o upload. A prévia autorizada mantém presentes e RSVP claramente em demonstração; não registra confirmações nem processa pagamentos.

Fluxo: local -> pacote com manifesto -> bundle dev -> notebook de preparação da pasta Git -> commit/push pelo notebook (publicar_git, serverless ambiente 5+) -> publicação automática no GitHub Actions após push na main. Consulte docs/entrega-databricks.md. O bundle não cria jobs nem compute; bundle sync envia os arquivos. O notebook precisa de runtime com arquivos de workspace e Git CLI na pasta Git. Upload não comprova push.

## Próxima etapa
Concluir revisão visual do refinamento e conteúdo pessoal; definir backend de presença/administração; escolher provedor e integrar checkout/webhook; definir prazo, traje, crianças e acompanhantes. A prévia já teve publicações aprovadas; cada nova entrega precisa de autorização própria. Confira deploy e experiência no domínio separadamente do push.
