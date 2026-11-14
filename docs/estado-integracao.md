# Estado da integração Vercel → HostGator → MySQL

## Resultado confirmado
Em 13/11/2026, os testes diretos na HostGator e pela Vercel retornaram HTTP 200 e:
```json
{"ok":true,"rows":[{"teste":1}]}
```
A confirmação é baseada nas saídas de terminal compartilhadas pelo usuário, não em uma auditoria independente do deploy.

## Arquitetura atual
```text
Cliente de teste (PowerShell)
  POST https://flavio-data-hub-backend.vercel.app/api/execute-sql
  X-Bridge-Token: <segredo>
  JSON: {"sql":"SELECT 1 AS teste"}
    → função backend/api/execute-sql.js na Vercel
    → POST https://casamento-flavio-victoria.com.br/api/execute-sql.php
    → PHP carrega configuração privada
    → PDO conecta ao MySQL e executa SELECT 1 AS teste
    → JSON retorna pela Vercel ao cliente
```
O cliente de teste atual usa o segredo da ponte. Não há integração de navegador validada nesta conversa; não incorporar esse segredo ao frontend.

## Arquivos e responsabilidades
- `backend/api/execute-sql.js`: função da Vercel. Compara o cabeçalho com `process.env.HOSTGATOR_BRIDGE_TOKEN` usando `timingSafeEqual`; aceita POST; encaminha JSON por HTTPS com timeout de 15 segundos e sem seguir redirects. Seu filtro antigo de SELECT ainda é mais amplo que a restrição do PHP. Confirmar conteúdo atual antes de mudanças.
- `public/api/execute-sql.php`: arquivo fonte do PHP publicado. Usa `hash_equals` para validar o token; exige POST; valida o JSON; aceita somente a consulta normalizada `select 1 as teste`; executa a string fixa `SELECT 1 AS teste`, não o SQL recebido.
- `/home2/hg8dcc78/public_html/api/execute-sql.php`: destino do PHP na HostGator.
- `/home2/hg8dcc78/casamento-private/bridge.php`: configuração privada que retorna array com chave `token`.
- `/home2/hg8dcc78/casamento-private/database.php`: configuração privada que retorna chaves `host`, `port`, `database`, `username`, `password`, `charset`.
- O PHP usa `$privateDir = '/home2/hg8dcc78/casamento-private'`. O caminho é específico da hospedagem.
- Configuração informada: MySQL local, porta 3306, charset utf8mb4. Credenciais não estão reproduzidas neste documento.

## Autenticação
Na Vercel, o segredo vem da variável de ambiente `HOSTGATOR_BRIDGE_TOKEN`. No PHP, vem do array retornado pelo arquivo privado `bridge.php`.
Não há validação em tabela `bridge_tokens` no código final apresentado. Referências anteriores a essa validação foram incorretas. Não há evidência suficiente para afirmar se essa tabela existe.
Os arquivos privados devem permanecer fora do repositório e da pasta pública. Não copiar segredos para logs, URLs, Markdown ou frontend.

## Publicação
Repositório: `flavio-bezerra/flavio-data-hub`, branch de trabalho escolhida pelo usuário: `main`.
Workflow: `.github/workflows/deploy.yml`, nome `Deploy to HostGator`.
Executa checkout, Node 24, npm ci, TypeScript, lint, build, verifica dist/.htaccess e publica `./dist/` por FTP com `SamKirkland/FTP-Deploy-Action@v4.3.5`, `server-dir: ./`. Ao final executa script de verificação do HTML/assets.
O PHP inicialmente estava em `backend/execute-sql.php`, que não era incluído na publicação de dist. Foi movido para `public/api/execute-sql.php`; após build/deploy o endpoint passou a responder.
O deploy da Vercel é separado do workflow da HostGator. Ready na Vercel não comprova publicação de PHP na HostGator.

## Problemas resolvidos
1. A URL PHP devolvia HTML do site, causando erro de parsing JSON e 502 na Vercel. A publicação no caminho público correto resolveu essa etapa.
2. PHP retornava 503 porque procurava token e credenciais em getenv(). Foi alterado para carregar os dois arquivos privados existentes.
3. Houve problemas de aspas com curl.exe no PowerShell. Os testes bem-sucedidos usaram Invoke-WebRequest com corpo gerado por ConvertTo-Json.
4. PHP CLI não estava disponível localmente (`php: command not found`). Os comandos git diff não validam sintaxe PHP.

## Limites do que foi comprovado
O SELECT 1 confirma conectividade e execução de uma consulta constante. Não comprova leitura de tabelas, privilégios mínimos, autorização por usuário, funcionamento do frontend, escrita, desempenho ou prontidão de produção.
O endpoint ainda tem nome execute-sql, mas no PHP funciona somente como diagnóstico fixo. Não ampliar para SQL arbitrário.

## Pendências resolvidas em 13/11/2026
- Testes negativos de autenticação (sem token e token inválido).
- Testes de método (GET), corpos inválidos (JSON quebrado, campos vazios e tipos errados).
- Teste de bloqueio contra consultas SQL diferentes da fixa (`SELECT 2` e ponto e vírgula).
- Registro detalhado em [docs/testes-ponte.md](file:///c:/Users/flavi/OneDrive/Documentos/07.%20Projetos/02.%20Python%20Scripts/flavio-data-hub/docs/testes-ponte.md).

## Pendências restantes
- Verificar versão de PHP e lint em ambiente compatível.
- Inspecionar privilégios do usuário do banco sem expor credenciais.
- Definir operações reais predefinidas com parâmetros e autorização apropriada.
- Verificar/remover diagnósticos antigos com aprovação: a captura do cPanel ainda mostrava bridge-check.php e health.php em public_html/api. Não foi confirmada remoção posterior.
- Identificar o item de arquivo chamado casamento-private dentro de public_html/api sem divulgar seu conteúdo; não confundir com a pasta privada real.
- Verificar publicação para garantir que respostas PHP não incluam warnings, caminhos ou credenciais.
- Não assumir que o FTP removeu arquivos só porque foram removidos do Git.
