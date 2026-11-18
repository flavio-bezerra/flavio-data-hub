# Ativação do backend Vercel e ponte HostGator

## Arquitetura vigente
Frontend HostGator -> gateway PHP no mesmo domínio -> APIs Node Vercel -> ponte PHP de operações fixas -> MySQL. Nenhum SQL é enviado pela Vercel; a ponte aceita enumeração fechada e consultas preparadas. A identidade do usuário é resolvida pela sessão persistida, não por account_id enviado pelo navegador. Operações internas de login recebem identidade já verificada pela Vercel, autenticada pelo segredo da ponte.

O endpoint execute-sql foi preservado, não ampliado. Pagamentos existentes intocados. server/entrada-api.php desativado. PHP de banco reutiliza os módulos de convites/admin/contexto; Google, SMTP, hash scrypt/verificação bcrypt e OpenRouter agora no Node.

## Vercel
Projeto existente flavio-data-hub-backend, Root Directory backend, instalar com npm ci do backend e redeploy separado. Variáveis: HOSTGATOR_BRIDGE_TOKEN (existente, >=32 caracteres, mesmo da HostGator), ACCESS_ENABLED=false inicialmente, APP_ORIGIN HTTPS exata, GOOGLE_CLIENT_ID, SMTP_HOST/PORT/SECURE/USER/PASSWORD/EMAIL_FROM. Google OAuth Web autoriza origem do site, não vercel.app, pois GIS aparece no navegador do site.

OpenRouter: OPENROUTER_API_KEY, compatível com alias OPENROUTE_SERVICE_TOKEN existente. ASSISTANT_ENABLED=false inicialmente, OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free somente fictícios, ASSISTANT_FICTIONAL_DATA_ONLY=true. Com convidados reais, escolher modelo pago revisado, fictional=false e ASSISTANT_PRIVACY_REVIEWED=true; solicita provider deny/ZDR sem relaxamento. Nenhum valor de chave deve entrar em VITE_*, Git, docs, prompt ou log.

## HostGator
Configuração existente /home2/hg8dcc78/casamento-private/{bridge.php,database.php} preservada. Novo application.php usando server/ponte/config.example.php: gateway_enabled=false, access_enabled=false, bootstrap_admin_email vazio. Instalar server/ sob casamento-private/server (não public_html), excluindo config.private, vendor, storage. Usa PHP8.2+, PDO MySQL, cURL TLS e mbstring para nome Google. Composer PHP não necessário para a nova rota. server/config.example.php/composer.json são legado desativado.

Instalar os gateways public/api/{auth,assistente,memoria,contexto,convites,confirmacoes}.php e operacoes.php em public_html/api. Deploy FTP atual publica apenas os gateways, não a pasta privada. Conferir se o caminho real corresponde ao já documentado. Gateway chama uma URL Vercel fixa, valida Origin, só encaminha o cookie casamento_access e CSRF; não encaminha cookies/token arbitrários nem segue redirects. Nó Vercel exige credencial de gateway antes de qualquer leitura; CORS externo não é necessário. Token de ponte nunca retornado.

## Banco e ativação por etapas
Banco de teste: aplicar001,002,003 em ordem; não reaplicar001/002 em banco onde já existam.003 adiciona sessões revogáveis de2h, token hash SHA256, CSRF e nonce. Backup banco antes. Configuração times UTC. Autorizar arquivos privados, migração e flags separadamente.

Habilitar gateway/access na configuração privada e ACCESS_ENABLED na Vercel apenas na homologação coordenada; validar login Google/senha/verificação/recuperação/logout, duas instâncias Node compartilhando sessão, CSRF/origin, reset revoga todas sessões, convite disputado e isolamento. Sem tokens/flags, responde503. Configurar SMTP465 com TLS e remetente validado, não enviar testes automaticamente.

Administrador inicial: criar/verificar conta de teste, definir e-mail só em application.php privado, executar bootstrap-administrador.php --confirmar em CLI; exige zeroadmins, permanece privado. Seu email pessoal não deve constar em Git/SQL/frontend. Não expor bootstrap por HTTP.

Assistente: cadastrar/publicar fatos fictícios, ligar ASSISTANT_ENABLED só após login/banco. Memória/mesas/vans no painel; filtro por responsável ativo refeito na ponte. context_key impede reenviar histórico antigo após mudança de contexto e revalida antes de entregar resposta; dados já exibidos no navegador não são apagados remotamente na hora da transferência. Perguntas/textos gerais livres exigem política e medidas de privacidade antes de dados reais. Não substitui conclusão do RSVP/cadastro/consentimento alimentar, ainda parciais.

## Operação e rollback
Nenhum deploy/migração/chamada real nesta mudança local. Rollback: desligar ACCESS_ENABLED e ASSISTANT_ENABLED, gateway/access privados; não restaurar segundo login PHP. Sessões antigas PHP não migram: entrar novamente. Preservar003 e dados até decisão explícita. Limpar sessões expiradas e rate windows via rotina de manutenção a homologar.

## Evidências
Validação local concluída em17/11/2026: npm ci do backend com scripts lifecycle desabilitados,25 dependências; lockfile público reproduzível,25 tarballs conferidos na origem npm com integrity exato. TypeScript com -p tsconfig.app.json, lint e build exit0 (7warnings existentes).13 módulos Node e25 arquivos PHP passaram sintaxe.31 testes Node com ponte/OpenRouter/claims Google simulados passaram;12 gates PHP/SQLite fictício validaram sessões, isolamento por grupo, rascunhos, transferência, revogação, expiração e administração. Relatórios/scripts de verificação salvos fora do código de produção em Downloads/adaptar-vercel e artefatos do chat.

Instalação Node e lockfile do backend são independentes do frontend; lockfile raiz preservado. Nenhuma conexão MySQL, envioSMTP, chamada realGoogle/OpenRouter, migração ou publicação executada. Testes simulados NÃO homologam MySQL/transações/concorrência, cookie e gateway real, deploymentVercel, Google, SMTP/Titan ou qualidade do modelo. Revisão visual específica do comportamento de troca de contexto permanece pendente; layout não alterado.
