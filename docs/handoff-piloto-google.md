# Piloto da Área do Convidado — guia para outro computador ou assistente

## Branches e responsabilidades

- `main`: fonte de verdade do frontend (`src/`), funções Vercel (`backend/`), gateways públicos (`public/api/`), PHP privado (`server/`) e SQL (`database/`). O push na `main` dispara os deploys automáticos; não muda variáveis de ambiente, não envia `server/` para a HostGator e não executa migrações.
- [`instalacao/piloto-login-google`](https://github.com/flavio-bezerra/flavio-data-hub/tree/instalacao/piloto-login-google/instalacao/piloto-login-google): espelho dos arquivos privados, exemplos vazios, dois ZIPs e README de instalação. Use como material de transferência, não faça merge dessa branch na `main` e não implante essa branch na Vercel. Na dúvida, regenere o pacote a partir do commit de código que será homologado.

No outro computador, clone `https://github.com/flavio-bezerra/flavio-data-hub.git`, leia `AGENTS.md`, este documento e `docs/ativacao-vercel.md`. Comece com `git status`, `git fetch origin` e `git log -1 origin/main`. Não sobrescreva alterações do usuário. Anote o SHA homologado e confirme no painel Vercel que o projeto `flavio-data-hub-backend` usa `backend/` como raiz. Mantenha o teto de 12 funções; memória e contexto compartilham uma função. Não modifique pagamentos, webhook, `execute-sql`, DNS ou o menu para este piloto.

## Preparar os arquivos para o cPanel

O ZIP privado deve ter `server/` na raiz. Use esta lista fechada de caminhos do commit homologado:

| Origem | Destino dentro de `casamento-private/` |
| --- | --- |
| `server/ponte/{gateway,operacoes,sessoes,contas,config.example}.php` | `server/ponte/` |
| `server/{autenticacao,administracao,convites}.php` | `server/` |
| `server/assistente/{contexto-da-festa,administracao-memoria,administracao-contexto}.php` | `server/assistente/` |

Exclua `.env*`, configurações reais, logs, `storage/`, `vendor/` e o bootstrap administrativo. Mantenha o ZIP SQL separado com `database/001-presenca-e-autenticacao.sql`, `002-contexto-da-festa.sql`, `003-sessoes-e-ponte.sql`. Se o ZIP anterior já foi extraído, confira a versão e o caminho antes de reenviar. Nunca envie o ZIP privado ou suas configurações para `public_html`. Caso já exista `server/`, faça backup antes de substituir arquivos. O caminho esperado pelo código é `/home2/hg8dcc78/casamento-private`; confirme no cPanel.

Crie ou revise no cPanel, fora do Git, estes arquivos:

- `application.php`: modele com `server/ponte/config.example.php`. Comece com `gateway_enabled=false`, `access_enabled=false` e `bootstrap_admin_email` vazio. Preserve valores existentes não relacionados.
- `database.pilot.php`: use `database.pilot.example.php` da branch de instalação. Preencha `host`, `port`, `database`, `charset`, `username`, `password` localmente. Envie somente ao cPanel e use um usuário vinculado apenas ao banco piloto. O código não faz fallback para `database.php`.
- `bridge.php` e `database.php` existentes: preserve ambos. Não copie valores de token/senha para chat, GitHub, artefatos, arquivos públicos ou logs.

## Banco e ativação controlada

1. No cPanel, crie um banco vazio separado na mesma hospedagem (ou reutilize um **já separado para o piloto**). No phpMyAdmin, selecione esse banco e importe os SQLs em ordem 001 → 002 → 003. Pare no primeiro erro; não reimporte às cegas. Confira `accounts`, `access_rate_limits` e `web_access_sessions`. Não rode o SQL no banco atual do site e não execute o bootstrap administrativo.
2. Confirme PHP 8.2+, PDO MySQL, cURL e mbstring. Na Vercel, preserve o token existente da ponte. Confira o OAuth Google tipo Web com a origem `https://casamento-flavio-victoria.com.br`, configure `GOOGLE_CLIENT_ID` e `ACCESS_GOOGLE_PILOT_EMAIL` para uma única conta Gmail ou Google Workspace. O e-mail fica só nessa variável privada, nunca `VITE_*`. Mantenha `ASSISTANT_ENABLED=false` e não altere SMTP. Se mudar variáveis, confirme um novo deploy com elas.
3. Só com autorização de ativação e depois de conferir a versão e o banco, habilite `gateway_enabled` e `access_enabled` no cPanel e `ACCESS_ENABLED` na Vercel. Não divulgue `/acesso` no menu. Se algo falhar, desabilite as flags; não apague tabelas para diagnosticar.

## Roteiro de testes para executar no outro computador

**Local:** frontend com `npm ci`, `npx tsc --noEmit -p tsconfig.app.json`, `npm run lint` e `npm run build`; backend com `npm ci` em `backend/` e `node --check` nos módulos alterados; PHP com `php -l` nos arquivos privados. Use fixtures para verificar que a conta não autorizada é bloqueada antes de criar conta e que senha e chat não são ativados. Redija logs e use somente contas fictícias quando possível.

**Publicado, após autorização:** acesse `/acesso`, confirme login com a única conta autorizada, rejeição de outra conta Google e logout; recarregue durante a sessão para checar persistência e confira que, depois do logout, a sessão não é reutilizada. A tela pode ainda mostrar o formulário de senha, mas cadastro, login por senha, verificação e recuperação devem ser recusados pelo backend. O botão do chat pode aparecer depois de entrar, mas a API precisa permanecer indisponível. Não use convidados, pagamentos ou dados alimentares reais. Se houver HTTP 503, registre só o status e a mensagem sanitizada: “Gateway ainda não configurado” aponta à instalação privada; “Acesso ainda não habilitado” à flag Vercel; “Login de teste ainda não configurado” às variáveis Google do piloto. Outros 503 exigem consultar logs privados sem copiar valores sensíveis.

**Entrega:** registre SHA publicado, status dos dois deploys, banco piloto confirmado, passos executados e pendências. Nunca marque um teste simulado como homologação real. Antes de trocar a conta autorizada, desligue o piloto e revogue as sessões no banco de teste; não ative cadastro por senha ou assistente sem revisão separada.
