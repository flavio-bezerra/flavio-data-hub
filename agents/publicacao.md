# Rota de publicação — em validação

Fluxo aprovado: desenvolvimento/testes locais -> bundle dev isolado -> notebook de preparação da pasta Git -> commit/push autorizado pelo notebook -> publicação manual no GitHub Actions -> HostGator. Consulte docs/entrega-databricks.md.

O repositório local e a pasta Git informada usam https://github.com/flavio-bezerra/flavio-data-hub. Pasta Databricks: /Users/flavio.bezerra@kinea.com.br/flavio-data-hub (ID 1416539554243551). A inspeção confirmou main e git_cli_enabled=true. Isso não comprova commit/push executável ou permissão de escrita.

CLI moderna encontrada em C:\Program Files\Databricks\databricks.exe; use caminho explícito para evitar o launcher Python legado no PATH. Perfil escolhido pelo usuário: flaviobezerra. Guarde autenticação fora do projeto.

## Gate de entrega
Entregue o projeto completo autorizado, incluindo .github/workflows/deploy.yml com workflow_dispatch. Essa alteração precisa entrar no mesmo commit para que push não publique o protótipo. Revise a prévia antes da aplicação na pasta Git. A aprovação visual e os testes locais precedem o acionamento manual do FTP. Preserve alterações remotas e concilie divergências antes da cópia.

## Bundle
databricks.yml sincroniza o código e entrega/site.bin (formato ZIP, extensão neutra) num alvo dev isolado com bundle sync --full. scripts/preparar-entrega-databricks.py gera o ZIP e manifesto com hashes e base Git. notebooks/preparar-pasta-git.py verifica destino, HEAD, conflitos e integridade antes da cópia, com previa por padrão. Execute o notebook em serverless ambiente 5+. previa confere também main remota e push --dry-run. publicar_git aplica, seleciona os arquivos do manifesto, faz commit com identidade do executor, push sem force e confirma o hash remoto. As credenciais permanecem gerenciadas pela plataforma. Se a gravação/commit/push falhar, preserve o estado e revise antes de repetir; a operação não é transacional. O bundle não cria job/compute nem publica na HostGator.

## Rede Azure e executor
Uma VNet fornece conectividade, não executa Git. Utilize uma VM/runner ou compute Databricks autorizado para este projeto, com saída HTTPS ao GitHub e credencial de escrita com escopo mínimo. Valide autorização de uso, DNS, proxy, certificados, firewall e NSG antes de executar. Preserve regras corporativas e solicite liberação pelos canais oficiais quando houver bloqueio. O acesso à pasta Git não comprova acesso de saída do compute.

## Estado da validação local — 10/11/2026
O protótipo e os guias foram escritos localmente. npm ci falhou; a tentativa com certificados do sistema também falhou com E403 Block-artifactory no registry npm. Build e lint não executaram por ausência de Vite/ESLint instalados. A validação visual permanece pendente. A configuração de entrega foi preparada para sincronização no workspace. Registre o resultado real do upload separadamente; a aplicação e o commit/push podem ser executados pelo assistente, mediante autorização. A instalação npm e as validações visuais continuam pendentes.

## Evidência necessária
Registre commit anterior, arquivos selecionados, novo commit, resultado do push e resultado do workflow. Só declare a rota oficial operacional após uma execução bem-sucedida. Publique frontend após build, TypeScript, lint relevante e aprovação visual. Nunca inclua convidados reais, códigos reais ou chaves no frontend/Git.
