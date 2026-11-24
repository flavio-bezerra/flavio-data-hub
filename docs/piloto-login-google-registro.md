# Registro — Piloto Login Google (Casamento Victória & Flávio)

**Data:** 23/11/2026  
**Projeto:** flavio-data-hub  
**Branch:** `main` (alinhada com `origin/main`)

---

## 1. Ajuste de versões do Git

A `main` local estava atrás de `origin/main` por 5 commits. Foi feito `git merge --ff-only origin/main` para alinhar.

Último commit: `d15c147 feat: publica código do piloto Google e guia de instalação`

## 2. Arquivos de `casamento-private/` trazidos para o `main`

Foram trazidos da branch remota `origin/instalacao/piloto-login-google` (commit `f186310`) e estão **staged**, aguardando commit:

| Arquivo | Função |
|---------|--------|
| `instalacao/piloto-login-google/casamento-private/application.example.php` | Modelo de configuração da aplicação |
| `instalacao/piloto-login-google/casamento-private/database.pilot.example.php` | Modelo de configuração do banco piloto |
| `instalacao/piloto-login-google/casamento-private/server/administracao.php` | Administração da ponte |
| `instalacao/piloto-login-google/casamento-private/server/assistente/administracao-contexto.php` | Módulo de contexto do assistente |
| `instalacao/piloto-login-google/casamento-private/server/assistente/administracao-memoria.php` | Módulo de memória do assistente |
| `instalacao/piloto-login-google/casamento-private/server/assistente/contexto-da-festa.php` | Contexto da festa |
| `instalacao/piloto-login-google/casamento-private/server/autenticacao.php` | Autenticação |
| `instalacao/piloto-login-google/casamento-private/server/convites.php` | Convites |
| `instalacao/piloto-login-google/casamento-private/server/ponte/config.example.php` | Configuração da ponte (referência) |
| `instalacao/piloto-login-google/casamento-private/server/ponte/contas.php` | Contas |
| `instalacao/piloto-login-google/casamento-private/server/ponte/gateway.php` | Gateway para Vercel |
| `instalacao/piloto-login-google/casamento-private/server/ponte/operacoes.php` | Operações MySQL permitidas |
| `instalacao/piloto-login-google/casamento-private/server/ponte/sessoes.php` | Sessões |

## 3. Arquivos criados localmente para o cPanel

Local: `C:\Users\flavi\OneDrive\Documentos\casamento-private\`

| Arquivo | Conteúdo principal |
|---------|-------------------|
| `application.php` | `gateway_enabled => false`, `access_enabled => false`, `bootstrap_admin_email => ''` |
| `database.pilot.php` | `host => localhost`, `port => 3306`, `database => hg8dcc78_piloto_casamento`, `charset => utf8mb4`, `username => hg8dcc78_piloto` |
| `migracao-piloto-completa.sql` | SQL combinado dos scripts 001 + 002 + 003 |

> **Nota:** A senha real do banco NÃO deve ser armazenada neste arquivo nem no Git. Preencher apenas no cPanel.

## 4. Banco de dados importado no cPanel

**Banco:** `hg8dcc78_piloto_casamento`  
**Usuário:** `hg8dcc78_piloto`

As 16 tabelas foram criadas com sucesso via importação do `migracao-piloto-completa.sql`:

1. `access_rate_limits`
2. `accounts`
3. `account_action_tokens`
4. `administrators`
5. `assistant_account_usage`
6. `assistant_memory_versions`
7. `assistant_publication`
8. `audit_events`
9. `event_logistics_versions`
10. `event_settings`
11. `food_authorizations`
12. `guests`
13. `guest_food_information`
14. `invitation_groups`
15. `web_access_sessions`
16. (tabelas do 001/002/003 conforme schema)

## 5. Variáveis de ambiente

### Google Cloud Console
- **GOOGLE_CLIENT_ID:** Criado (ID do cliente OAuth 2.0 — valor não armazenado aqui)
- **ACCESS_GOOGLE_PILOT_EMAIL:** E-mail único da conta piloto (valor não armazenado aqui)

### Vercel (projeto `flavio-data-hub-backend`)
| Variável | Valor |
|----------|-------|
| `GOOGLE_CLIENT_ID` | [criado no Google Cloud Console] |
| `ACCESS_GOOGLE_PILOT_EMAIL` | [e-mail da conta piloto] |
| `ASSISTENT_ENABLED` | `false` |
| `ACCESS_ENABLED` | `false` (inicialmente) |
| `HOSTGATOR_BRIDGE_TOKEN` | [token existente, ≥32 caracteres] |
| `APP_ORIGIN` | `https://casamento-flavio-victoria.com.br` |

### `.env.local` (local, ignorado pelo Git)
Contém `HOSTGATOR_BRIDGE_TOKEN`, `ASAAS_PAYMENT_TOKEN`, `OPENROUTER_API_KEY`, credenciais SMTP (Titan). **Não subir para o Git.**

## 6. O que NÃO fazer (do README do piloto)

- ❌ Não sobrescrever `bridge.php` nem `database.php` (já existem na hospedagem)
- ❌ Não enviar chaves, senhas ou e-mail pessoal para o GitHub
- ❌ Não enviar ZIP ou configuração para `public_html`
- ❌ Não executar `bootstrap-administrador.php` nesta etapa
- ❌ Não importar migrações no banco atual de produção

## 7. Próximos passos

1. Confirmar que `application.php` e `database.pilot.php` estão na pasta privada do cPanel
2. Preencher senha real em `database.pilot.php` no cPanel
3. Testar login Google no site (com flags em `false`):
   - `/acesso` deve mostrar formulário mas não executar login por senha
   - Login com conta do piloto deve funcionar
   - Login com outra conta deve ser recusado
   - Logout deve funcionar
   - Área do Convidado continua indisponível
4. Após confirmação, ativar:
   - cPanel: `gateway_enabled => true`, `access_enabled => true`
   - Vercel: `ACCESS_ENABLED=true`
5. Fazer commit dos 22 arquivos staged no git

## 8. Confirmação — Login Google funcionando (24/11/2026)

**Resultado: SUCESSO**

O teste de login via Google foi realizado com sucesso no domínio `https://casamento-flavio-victoria.com.br`.

### Evidências do teste

- Endpoint `/api/auth.php` retornando `HTTP 200 OK` com payload válido:
  - `ok: true`
  - `google_client_id` válido (formato `*.apps.googleusercontent.com`)
  - `google_nonce` gerado corretamente
  - Cookie `casamento_access` definido
- Página `/acesso` exibe: *"Olá, Flavio Menegueço Bezerra."*
- Botão de "Entrar com Google" renderizado após autenticação
- Mensagem exibida: *"Vinculação e cadastro do grupo estão em implementação."*

### O que foi ajustado para chegar aqui

1. **cPanel (`casamento-private/application.php`):**
   - `gateway_enabled => true`
   - `access_enabled => true`
   - `bootstrap_admin_email => ''`

2. **Vercel (`flavio-data-hub-backend`):**
   - `ACCESS_ENABLED=true` (depois de Redeploy)
   - `GOOGLE_CLIENT_ID` corrigido (foi confundido com Client Secret inicialmente)
   - `APP_ORIGIN = https://casamento-flavio-victoria.com.br`

3. **Correções de código (commits no `main`):**
   - `src/features/chat/ChatSidebar.tsx` criado (estava faltando, quebrava o build)
   - Import corrigido em `src/App.tsx` para default import
   - `vite.config.ts` aspas escapadas corrigidas (lint)
   - `gateway.php` ajustado para aceitar origem com e sem `www`
   - `backend/autenticacao/sessao.js` ajustado para aceitar origem com e sem `www`

4. **Diagnóstico temporário removido após confirmação:** `public/api/diagnostico.php` (apenas para depuração, não deve permanecer em produção)

### Próximos passos do piloto

- Testar login com conta **não autorizada** (deve ser recusada)
- Testar logout (deve funcionar e invalidar a sessão)
- Testar recarga de página para verificar persistência da sessão
- Concluir o piloto e, após homologação, considerar ativação de `ACCESS_GOOGLE_PILOT_EMAIL` para liberar o assistente de chat (atualmente bloqueado durante o piloto)
