# Ativação do backend Vercel e ponte HostGator

## Primeiro teste: somente login Google

Use apenas um banco MySQL vazio e separado. O pacote da ponte deve ser extraído dentro de `casamento-private`, nunca em `public_html`. Para este piloto, use `instalacao/piloto-login-google/casamento-private/server/ponte/config.example.php` como referência para criar `application.php`, inicialmente com as duas flags desligadas. Nunca sobrescreva `bridge.php` nem `database.php`. Crie `database.pilot.php` ao lado deles com a mesma estrutura de configuração (`host`, `port`, `database`, `charset`, `username`, `password`), apontando para o banco e usuário exclusivos do teste. A ponte piloto não faz fallback para `database.php`. Importe as três migrações na ordem numérica somente no banco de teste.

Depois de publicar o código do piloto na Vercel, configure `GOOGLE_CLIENT_ID` e `ACCESS_GOOGLE_PILOT_EMAIL` para uma única conta Gmail ou Google Workspace. O e-mail é variável privada, nunca `VITE_*`, e não é devolvido pela API. Preserve `ASSISTANT_ENABLED=false`. A API recusa cadastro, login por senha, verificação e recuperação por e-mail; o chat também fica bloqueado enquanto o piloto estiver configurado. O formulário de senha ainda pode aparecer na página, mas não executa essas operações. Só ligue `ACCESS_ENABLED` e as flags privadas após confirmar banco e versão publicada. Teste login, recusa de uma segunda conta e logout. Ao trocar a conta do piloto, encerre o teste e revogue as sessões existentes no banco de teste antes de religar.

Não execute o bootstrap administrativo nesta etapa: ele ainda usa a configuração `database.php` e não faz parte do piloto. Não divulgue `/acesso` no menu antes da homologação.

## Arquitetura vigente
Frontend HostGator -> gateway PHP no mesmo domínio -> APIs Node Vercel -> ponte PHP de operações fixas -> MySQL. Nenhum SQL é enviado pela Vercel; a ponte aceita enumeração fechada e consultas preparadas. A identidade do usuário é resolvida pela sessão persistida, não por account_id enviado pelo navegador. Operações internas de login recebem identidade já verificada pela Vercel, autenticada pelo segredo da ponte.

O endpoint execute-sql foi preservado e aceita SQL arbitrário via token da ponte; o uso operacional é o inicializador de schema fixo (`garantir-schema.php`) e diagnóstico controlado. Pagamentos existentes intocados. server/entrada-api.php desativado. PHP de banco reutiliza os módulos de convites/admin/contexto; Google, SMTP, hash scrypt/verificação bcrypt e OpenRouter agora no Node.

## Vercel
Projeto existente flavio-data-hub-backend, Root Directory backend, instalar com npm ci do backend e redeploy separado. Variáveis: HOSTGATOR_BRIDGE_TOKEN (existente, >=32 caracteres, mesmo da HostGator), ACCESS_ENABLED=false inicialmente, APP_ORIGIN HTTPS exata, GOOGLE_CLIENT_ID, SMTP_HOST/PORT/SECURE/USER/PASSWORD/EMAIL_FROM. Google OAuth Web autoriza origem do site, não vercel.app, pois GIS aparece no navegador do site.

OpenRouter: OPENROUTER_API_KEY, compatível com alias OPENROUTE_SERVICE_TOKEN existente. ASSISTANT_ENABLED=false inicialmente, OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free somente fictícios, ASSISTANT_FICTIONAL_DATA_ONLY=true. Com convidados reais, escolher modelo pago revisado, fictional=false e ASSISTANT_PRIVACY_REVIEWED=true; solicita provider deny/ZDR sem relaxamento. Nenhum valor de chave deve entrar em VITE_*, Git, docs, prompt ou log.

### Limite de funções no plano Hobby

O backend tem 12 arquivos de função em `backend/api/`. As URLs `/api/memoria` e `/api/contexto` são reescritas internamente pela Vercel para uma única função, `backend/api/administracao/[operacao].js`. Sessão, CSRF, limites de uso e permissões administrativas continuam em vigor. Frontend, gateway PHP e pagamentos não precisam de mudanças.

Antes de adicionar outra função, conte os arquivos em `backend/api/` e avalie se a nova rota pode compartilhar uma função existente. A validação local não substitui conferir as duas reescritas após o deploy na Vercel.

## HostGator
Os arquivos secretos existentes `/home2/hg8dcc78/casamento-private/{bridge.php,database.php}` permanecem privados. As flags operacionais sem segredo ficam em `server/application.php` no repositório; `bootstrap_admin_email` permanece vazio. O código versionado é publicado em `/home2/hg8dcc78/public_html/server/`; um `.htaccess` nessa pasta bloqueia acesso HTTP direto. Usa PHP8.2+, PDO MySQL, cURL TLS e mbstring para nome Google. Composer PHP não necessário para a nova rota. server/config.example.php/composer.json são legado desativado.

## Publicação automática do PHP privado

O workflow sincroniza `server/` para `public_html/server/` quando `HOSTGATOR_SERVER_DEPLOY_ENABLED=true`. Na primeira operação autenticada pela ponte, `garantir-schema.php` verifica o schema e cria tabelas ausentes com `CREATE TABLE IF NOT EXISTS`, sob lock MySQL. Não altera tabelas existentes. O envio exclui `config.private.php`, `bridge.php`, `database.php`, bancos de piloto e demais credenciais; `server/application.php` é versionado sem senha, token ou e-mail pessoal.

O workflow publica primeiro o `.htaccess`, verifica que o acesso direto retorna HTTP 403, sincroniza os PHP e só então publica as rotas públicas que os incluem. Se o gate estiver desligado e um commit alterar `server/`, o SQL de schema ou as rotas PHP correspondentes, o workflow falha antes de qualquer FTP para evitar uma implantação parcial. O inicializador cria tabelas ausentes, mas recusa schema parcial com colunas/índices faltando; nesses casos, use o verificador e aplique uma migração específica após backup.

Depois do primeiro deploy bem-sucedido e do teste das APIs, remova uma única vez a cópia antiga `casamento-private/server/`, o `server.zip` e o antigo `application.php` privado no cPanel, se ainda existirem. Preserve `bridge.php`, `database.php` e os arquivos de credenciais do piloto. Depois dessa limpeza, alterações versionadas em `server/` acompanham os pushes autorizados à `main`, sem edição manual de PHP no cPanel. Migrações de banco, quando necessárias, continuam separadas e não são executadas pelo workflow.

As rotas `public/api/{auth,assistente,memoria,contexto,convites,confirmacoes}.php` e `operacoes.php` permanecem em `public_html/api`. O workflow publica `dist/` normalmente e, com o gate ligado, também sincroniza `server/` para `public_html/server/`; as credenciais não são incluídas. Gateway chama uma URL Vercel fixa, valida Origin, só encaminha o cookie casamento_access e CSRF; não encaminha cookies/token arbitrários nem segue redirects. Nó Vercel exige credencial de gateway antes de qualquer leitura; CORS externo não é necessário. Token de ponte nunca retornado.

## Banco e ativação por etapas
Banco de teste: aplicar001,002,003 em ordem; não reaplicar001/002 em banco onde já existam.003 adiciona sessões revogáveis de2h, token hash SHA256, CSRF e nonce. Backup banco antes. Configuração times UTC. Autorizar arquivos privados, migração e flags separadamente.

Após o piloto Google, login/senha, verificação, recuperação e SMTP exigem revisão e homologação separadas. Valide também sessões entre instâncias, CSRF/origem, disputa pelo convite e isolamento antes de liberar convidados reais.

Administrador inicial: criar/verificar conta de teste e executar `php server/bootstrap-administrador.php --confirmar` no terminal autorizado. Com o campo versionado vazio, o CLI solicita o e-mail interativamente; ele não é salvo no Git, SQL ou frontend. O bootstrap exige zero administradores e não deve ser exposto por HTTP.

Assistente: cadastrar/publicar fatos fictícios, ligar ASSISTANT_ENABLED só após login/banco. Memória/mesas/vans no painel; filtro por responsável ativo refeito na ponte. context_key impede reenviar histórico antigo após mudança de contexto e revalida antes de entregar resposta; dados já exibidos no navegador não são apagados remotamente na hora da transferência. Perguntas/textos gerais livres exigem política e medidas de privacidade antes de dados reais. Não substitui conclusão do RSVP/cadastro/consentimento alimentar, ainda parciais.

## Operação e rollback
Nenhum deploy/migração/chamada real nesta mudança local. Rollback: desligar ACCESS_ENABLED e ASSISTANT_ENABLED, gateway/access privados; não restaurar segundo login PHP. Sessões antigas PHP não migram: entrar novamente. Preservar003 e dados até decisão explícita. Limpar sessões expiradas e rate windows via rotina de manutenção a homologar.

## Evidências
Validação local concluída em17/11/2026: npm ci do backend com scripts lifecycle desabilitados,25 dependências; lockfile público reproduzível,25 tarballs conferidos na origem npm com integrity exato. TypeScript com -p tsconfig.app.json, lint e build exit0 (7warnings existentes).13 módulos Node e25 arquivos PHP passaram sintaxe.31 testes Node com ponte/OpenRouter/claims Google simulados passaram;12 gates PHP/SQLite fictício validaram sessões, isolamento por grupo, rascunhos, transferência, revogação, expiração e administração. Relatórios/scripts de verificação salvos fora do código de produção em Downloads/adaptar-vercel e artefatos do chat.

Instalação Node e lockfile do backend são independentes do frontend; lockfile raiz preservado. Nenhuma conexão MySQL, envioSMTP, chamada realGoogle/OpenRouter, migração ou publicação executada. Testes simulados NÃO homologam MySQL/transações/concorrência, cookie e gateway real, deploymentVercel, Google, SMTP/Titan ou qualidade do modelo. Revisão visual específica do comportamento de troca de contexto permanece pendente; layout não alterado.
