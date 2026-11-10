# Desenvolvimento híbrido e continuidade entre ambientes

Atualizado em 10/11/2026. Este documento descreve a operação do projeto, não concede autorização para publicar ou para contornar restrições de rede.

## Princípio de trabalho

O site de Victória & Flávio é desenvolvido de forma híbrida, por pessoas e assistentes em computadores diferentes, com limitações distintas de rede, ferramentas e autenticação. O repositório GitHub https://github.com/flavio-bezerra/flavio-data-hub é o ponto de integração do código. O nome flavio-data-hub é histórico: o produto atual é exclusivamente o casamento.

Cada computador usa um clone independente. Mudanças ainda sem push existem somente naquele ambiente. Um assistente acompanha commits publicados quando solicitado; não monitora automaticamente alterações privadas em outras máquinas. Informe branch e SHA na passagem de trabalho.

## Ambientes e responsabilidades

| Ambiente | Responsabilidade | Limitações e configuração |
|---|---|---|
| Windows Kinea | Edição, instalação, testes e prévia local | npm público e GitHub podem ser bloqueados; usar Artifactory e certificados confiáveis do Windows. PowerShell/bash indisponíveis no fluxo do assistente; usar ferramentas locais ou CMD autorizado |
| Computador pessoal | Clone independente, edição, testes e Git conforme acesso disponível | npm público com TLS; não depende de Python para iniciar o site. Instalação limpa fora da rede corporativa ainda precisa ser confirmada |
| Databricks | Transporte alternativo autorizado e executor Git | Bundle isolado, pacote com manifesto, notebook serverless ambiente 5; credenciais gerenciadas pela plataforma. Não hospeda o frontend |
| GitHub Actions | Validação e publicação | Push na main aciona testes, build, FTP e verificação HTTP; workflow_dispatch também disponível |
| HostGator | Hospedagem estática do build | Domínio aponta para /public_html; raiz relativa da conta FTP é questão distinta. Preservar destino validado |

A existência de uma VNet não fornece um executor Git. Qualquer infraestrutura adicional requer decisão e autorização próprias; não há VNet/VM provisionada por este projeto.

## Iniciar o site

Use Node compatível com Vite 7 (o projeto recomenda Node 24 LTS). Na raiz do clone, execute visualizar-site-kinea.bat ou visualizar-site-pessoal.bat. visualizar-site.bat delega à opção Kinea. O endereço local é http://127.0.0.1:8080; Ctrl+C encerra o servidor. Os BATs usam a pasta em que estão, sem fixar o caminho do clone, e exigem a porta disponível.

Os BATs instalam dependências quando Vite está ausente. Após mudança de package-lock.json, reinstale com npm ci no registry apropriado: a simples existência de node_modules não comprova atualização das dependências.

Na Kinea, a primeira instalação usa scripts/preparar-certificados-npm.py e precisa de Python. O script exporta certificados TLS confiáveis do Windows, sem chaves privadas, para .local/certificados-npm.pem. O npm usa cafile absoluto, strict-ssl=true e o mirror https://artifactory.prod.aws.cloud.ihf/artifactory/api/npm/npm-remotes/. Não muda configuração global nem o lockfile.

Na máquina pessoal, use registry.npmjs.org com TLS ativo. Não copie node_modules, .local, certificados corporativos, .databricks ou credenciais entre computadores. Instale a partir de package-lock.json. Erros de acesso devem ser tratados no ambiente correspondente, sem desativar TLS ou políticas de segurança.

## Validação antes de entregar

Na raiz do projeto, em CMD:

```cmd
node node_modules\typescript\bin\tsc --noEmit -p tsconfig.app.json
npm run lint
npm run build
```

Os três comandos precisam terminar com exit 0. Registre warnings separadamente: na validação do refinamento botânico houve 0 erros e 7 warnings Fast Refresh de componentes shadcn, além do aviso de Browserslist antigo. Isso não equivale a ausência de dívida técnica.

Teste a página principal e /convite/demonstracao, navegação por âncora, menu móvel, resposta parcial/completa e retorno ao site. Verifique 320px, celular e desktop, imagens, foco e movimento reduzido. Critérios visuais estão em identidade-e-layout.md. Build aprovado não comprova renderização no navegador nem publicação.

## Trocar de máquina e incorporar contribuições

Antes de começar, leia AGENTS.md e identifique branch, HEAD, mudanças locais e commits remotos. Preserve trabalho não commitado. Em um clone limpo com acesso direto, atualize a branch a partir do GitHub antes de editar. Para trabalho que não deve publicar ainda, use uma branch de desenvolvimento.

Após uma contribuição feita em outra máquina, traga os novos commits para o ambiente de origem antes de preparar nova entrega. Havendo divergência, faça conciliação explícita; não substitua arquivos remotos por uma cópia antiga. Não use force push ou reset destrutivo como solução automática.

Na Kinea, fetch direto pode receber 403. A rota já validada exporta um Git bundle read-only pela pasta Git Databricks, verifica SHA256 e referências e incorpora a base local preservando o working tree e seus backups. A conciliação é específica à base observada; não reutilize scripts com SHAs antigos sem revisão. Atualize também a documentação de passagem. Consulte entrega-databricks.md.

## Publicação direta e rota alternativa

Se o ambiente pessoal permitir Git direto, um push autorizado no mesmo repositório participa do mesmo fluxo. Databricks é alternativa para o ambiente restrito, não requisito para todos os computadores. As duas rotas convergem no GitHub.

No fluxo Databricks: gerar entrega/site.bin com manifesto e hashes; validar/sincronizar bundle dev; executar notebook de conferência; aplicar/commit/push somente após autorização. A pasta de destino precisa estar limpa e na base esperada. O notebook confere o remoto e confirma o SHA após push sem force. Credencial precisa de permissão workflow quando o commit modifica Actions. Um push --dry-run não garante todos os escopos exigidos no push efetivo.

Se falhar após gravação ou commit, preserve o estado e investigue. Pode haver um commit válido pendente de push. Nesse caso, retome somente o push depois de verificar o estado; não reaplique a entrega nem crie um commit duplicado.

## O que cada evidência comprova

| Evidência | Comprova | Não comprova |
|---|---|---|
| Build/tsc/lint locais | Código passa nas verificações daquele ambiente | Site publicado |
| bundle sync concluído | Arquivos chegaram à pasta isolada do workspace | Aplicação na pasta Git |
| Saída do notebook com SHA remoto | Commit/push confirmado | Deploy HostGator |
| Action aprovado | Pipeline, FTP e checagem pós-upload aprovados no runner | Experiência visual em todas as redes/navegadores |
| Teste no domínio | Experiência observada naquela origem | Funcionamento universal ou backend real |

Cada push na main dispara publicação automática. A autorização anterior para uma entrega não é autorização permanente para outras entregas. Commit local, push e deploy devem ser descritos separadamente. Falha pós-FTP não provoca rollback automático; uma reversão requer plano e autorização, normalmente por novo commit de reversão e nova publicação.

## Passagem de trabalho

Registre data, máquina/ambiente, branch, SHA base local e SHA remoto observado; arquivos alterados; propósito; verificações aprovadas; limitações; operação em andamento e seus IDs; necessidade de conciliação; e próximo passo autorizado. Compartilhe logs redigidos, sem tokens, cookies ou dados reais de convidados.

Em 10/11/2026, o refinamento botânico teve push confirmado em 55d6a0d74bd5b14614ea2593071c646febdd2299, parent de8a00ff8caa529441975b1c9e7eda202b48ab0a. Foram conferidos 122 arquivos e 23 alterações no notebook. A base local permaneceu de8a00f com alterações equivalentes à entrega; conciliar antes do próximo pacote. O resultado do Action dessa versão ainda não foi conferido nesta passagem. Estes SHAs são um registro histórico, não constantes para futuras entregas.

## Mapa de documentação

README.md: entrada rápida. AGENTS.md: contrato dos agentes. estrutura-e-regras.md: produto e regras. identidade-e-layout.md: identidade e critérios visuais. entrega-databricks.md: procedimento de transporte/publicação. origem-botanica.md: licença dos assets. agents/: guias resumidos por especialidade.
