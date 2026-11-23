# Piloto de login Google — o que vai em cada pasta

A pasta `casamento-private/` deste diretório é um espelho do que vai para a pasta privada já existente no cPanel. O ZIP `ponte-privada-piloto.zip` contém os mesmos arquivos de `server/`; se você já o extraiu e viu `casamento-private/server/ponte/gateway.php`, **não precisa enviar o `server/` de novo**.

| Arquivo/pasta | Destino e função |
| --- | --- |
| `casamento-private/server/ponte/` | Gateway para Vercel, operações permitidas de MySQL, contas e sessões. `config.example.php` é só referência. |
| `casamento-private/server/assistente/` | Módulos PHP de consulta e administração de contexto que a ponte carrega. Não ativa o chat. |
| `casamento-private/server/*.php` | Funções usadas pela ponte para autenticação, convites e permissões. |
| `casamento-private/application.example.php` | Modelo. Se ainda não existir `application.php`, copie com esse nome na própria pasta privada. Mantenha as duas flags `false` até coordenar a ativação. Não substitua uma configuração existente sem revisá-la. |
| `casamento-private/database.pilot.example.php` | Modelo. Crie `database.pilot.php` na pasta privada com os dados exclusivos do banco novo. Não substitua `database.php`. A ponte piloto não usa o banco atual como alternativa. |
| `sql-banco-de-teste.zip` | Fica no computador. Extraia e importe os três `.sql` no phpMyAdmin, na ordem 001, 002 e 003, somente em banco MySQL novo e vazio. |

## O que não copiar nem substituir

`bridge.php` e `database.php` já existem na hospedagem e devem ser preservados. Não copie quaisquer chaves, senhas ou e-mail pessoal para o GitHub. Não envie ZIP ou configuração para `public_html` e não execute o bootstrap administrativo neste piloto. O gateway público em `public_html/api/` foi publicado anteriormente e não faz parte dos arquivos privados.

## Preparar não é ativar

1. No cPanel, deixe `server/` extraído na pasta privada e crie os dois arquivos de configuração locais a partir dos modelos. Use banco e usuário exclusivos do piloto; a senha fica só no cPanel.
2. Importe as migrações no banco novo. Não rode nenhuma importação sobre o banco atual.
3. O código Node do piloto precisa ser publicado na Vercel separadamente: esta branch é só de instalação. Configure ali `GOOGLE_CLIENT_ID` e `ACCESS_GOOGLE_PILOT_EMAIL` (conta única), e preserve `ASSISTANT_ENABLED=false`. Não altere o token existente da ponte.
4. Só depois de confirmar que a Vercel está no código do piloto e que a conexão aponta para o banco novo, coordene `gateway_enabled` e `access_enabled` no cPanel e `ACCESS_ENABLED` na Vercel. Sem isso, a Área do Convidado continua indisponível, como esperado. Para desligar, volte as flags para `false`.

Não há dados reais, configuração pronta ou migração executada nesta pasta.
