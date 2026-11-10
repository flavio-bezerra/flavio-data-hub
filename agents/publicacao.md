# Rota de publicação — Databricks validado

Fluxo aprovado: desenvolvimento/testes locais -> bundle dev isolado -> notebook de preparação da pasta Git -> commit/push autorizado pelo notebook -> publicação automática após push na main -> GitHub Actions -> HostGator; workflow_dispatch permanece disponível. Consulte docs/entrega-databricks.md.

O repositório local e a pasta Git informada usam https://github.com/flavio-bezerra/flavio-data-hub. Pasta Databricks: /Users/flavio.bezerra@kinea.com.br/flavio-data-hub (ID 1416539554243551). Commit/push em main validado em serverless ambiente 5 com credenciais da plataforma; primeira entrega confirmada no commit f2809f07ff91a902dcaeb4a7a4ed15d46afb71cf. A credencial necessita permissão workflow ao modificar GitHub Actions.

CLI moderna encontrada em C:\Program Files\Databricks\databricks.exe; use caminho explícito para evitar o launcher Python legado no PATH. Perfil escolhido pelo usuário: flaviobezerra. Guarde autenticação fora do projeto.

## Gate de entrega
Entregue o projeto completo autorizado, incluindo .github/workflows/deploy.yml com workflow_dispatch. Push na main aciona a publicação automaticamente, por autorização do usuário; mantenha presentes e RSVP explicitamente em demonstração enquanto não houver backend. Revise a prévia antes da aplicação na pasta Git. A aprovação visual e os testes locais precedem o push que aciona o FTP. Preserve alterações remotas e concilie divergências antes da cópia.

## Bundle
databricks.yml sincroniza o código e entrega/site.bin (formato ZIP, extensão neutra) num alvo dev isolado com bundle sync --full. scripts/preparar-entrega-databricks.py gera o ZIP e manifesto com hashes e base Git. notebooks/preparar-pasta-git.py verifica destino, HEAD, conflitos e integridade antes da cópia, com previa por padrão. Execute o notebook em serverless ambiente 5+. previa confere também main remota e push --dry-run. publicar_git aplica, seleciona os arquivos do manifesto, faz commit com identidade do executor, push sem force e confirma o hash remoto. As credenciais permanecem gerenciadas pela plataforma. Se a gravação/commit/push falhar, preserve o estado e revise antes de repetir; a operação não é transacional. O bundle não cria job/compute nem publica na HostGator.

## Rede Azure e executor
Uma VNet fornece conectividade, não executa Git. Utilize uma VM/runner ou compute Databricks autorizado para este projeto, com saída HTTPS ao GitHub e credencial de escrita com escopo mínimo. Valide autorização de uso, DNS, proxy, certificados, firewall e NSG antes de executar. Preserve regras corporativas e solicite liberação pelos canais oficiais quando houver bloqueio. O acesso à pasta Git não comprova acesso de saída do compute.

## Estado da validação local — 10/11/2026
Instalação local aprovada: 389 pacotes pelo Artifactory com certificados confiáveis do Windows e TLS ativo. visualizar-site.bat abre o servidor em 127.0.0.1:8080. Código de portfólio removido por autorização; validar novamente TypeScript, lint e build após a limpeza. Publicação da prévia autorizada pelo usuário, mantendo RSVP e presentes em demonstração. Workflow usa npm ci e interrompe o FTP se TypeScript, lint, build ou .htaccess falharem. Registrar resultados das execuções, commit/push e publicação separadamente.

## Diagnóstico HostGator — teste controlado
Domínio principal aponta para /public_html; FTP continua ./ com origem ./dist/. Vite base / e saída dist preservados. Restaurado public/.htaccess do portfólio commit 47053b4 para testar a diferença de rewrite, sem desativar segurança. scripts/verificar-publicacao.mjs confere HTML, status/tipos JS/CSS e SHA256 contra dist após FTP; falha não implica rollback do upload. Aprovação HTTP não substitui teste visual. Erros observados: 499 no navegador do usuário e 406 ModSecurity na consulta externa; causa ainda não confirmada.

## Evidência necessária
Registre commit anterior, arquivos selecionados, novo commit, resultado do push e resultado do workflow. Só declare a rota oficial operacional após uma execução bem-sucedida. Publique frontend após build, TypeScript, lint relevante e aprovação visual. Nunca inclua convidados reais, códigos reais ou chaves no frontend/Git.
