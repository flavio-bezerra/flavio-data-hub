# Entrega completa via Databricks

## Caminhos
Bundle: /Workspace/Users/flavio.bezerra@kinea.com.br/.bundle/casamento-victoria-flavio/dev/files
Notebook: notebooks/preparar-pasta-git (a interface pode mostrar a extensão .py).
Pacote: entrega/site.bin, formato ZIP com extensão neutra para importação como arquivo; manifesto-entrega.json dentro do ZIP.
Pasta Git de destino: /Workspace/Users/flavio.bezerra@kinea.com.br/flavio-data-hub, ID 1416539554243551.

## Preparar localmente (Windows CMD)
Na raiz do site, execute:
```cmd
python scripts\preparar-entrega-databricks.py
"C:\Program Files\Databricks\databricks.exe" bundle validate --strict -t dev --profile flaviobezerra
"C:\Program Files\Databricks\databricks.exe" bundle sync --full -t dev --profile flaviobezerra
```
Não é necessário criar um job ou cluster para enviar arquivos. O bundle usa pasta isolada e não modifica a pasta Git durante o upload. O ZIP preserva bytes originais, inclusive notebooks, binários e lockfiles. Segredos, dependências instaladas, builds e arquivos de verificação ficam fora. A pasta entrega/ é ignorada pelo Git; somente o ZIP é incluído explicitamente na sincronização do bundle.

## Execução no Databricks
Use serverless com ambiente versão 5+; o teste nesse ambiente passou sem exceção safe.directory. O assistente pode submeter e acompanhar o notebook. acao=previa confere a entrega e testa push --dry-run; acao=publicar_git aplica, cria commit e push sem force, confirmando o hash remoto. A autorização do usuário para publicar Git é necessária. Credenciais ficam na plataforma. Se ocorrer falha após gravação/commit, preserve o estado e diagnostique antes de repetir.
Abra o notebook acima no bundle e conecte um compute autorizado que tenha arquivos de workspace e Git CLI habilitado. Execute com acao=previa. Ele verifica URL, branch main, pasta Git limpa, HEAD igual à base e hashes de todos os arquivos. Se houver conflito, pare e concilie: nenhuma cópia é iniciada antes da conferência completa.

Após revisar a lista, selecione acao=aplicar e execute novamente. acao=aplicar grava apenas alterações; acao=publicar_git também faz commit/push. Ela não é uma transação: se houver falha durante a gravação, preserve as alterações e revise antes de prosseguir. Se o runtime não permitir Git CLI ou escrita nos arquivos do workspace, solicite ajuste do ambiente; o upload permanece disponível, mas a preparação não está validada.

Abra a pasta Git original, revise as alterações e faça commit/push na main pela interface. O workflow .github/workflows/deploy.yml publica após push na main, mantendo workflow_dispatch como alternativa manual. Mensagem sugerida: feat: estrutura do site de casamento e entrega Databricks.

## Publicação e validação
O usuário autorizou publicação automática da prévia após push na main. TypeScript, lint (0 erros) e build foram aprovados localmente após a limpeza do portfólio. O workflow repete essas verificações antes do FTP. Confirme o SHA remoto e o resultado do GitHub Actions separadamente; push não comprova deploy concluído.

## Repetir uma entrega
Regere o ZIP e sincronize o bundle. Após um push, concilie o Git local com o commit remoto antes da próxima entrega: o notebook exige a mesma base Git e pasta de destino limpa. O manifesto cobre também exclusões de arquivos rastreados. O pacote contém código-fonte e referências Git, não a história .git.
