# Instalação do piloto de login Google

Esta branch guarda só os pacotes de instalação. O código de autenticação do piloto na Vercel ainda não foi publicado. Não habilite as flags antes de publicar esse código e conferir a configuração de teste.

| Arquivo | Destino |
| --- | --- |
| `ponte-privada-piloto.zip` | Gerenciador de Arquivos do cPanel → `casamento-private`, fora de `public_html`. |
| `sql-banco-de-teste.zip` | Extraia no computador e importe `001`, `002` e `003`, em ordem, no phpMyAdmin, somente em banco MySQL novo e vazio. |

Se já existir `casamento-private/server/`, faça backup e confira os arquivos antes de substituir. Não sobrescreva `bridge.php`, `database.php` nem qualquer configuração existente. Crie `database.pilot.php` na área privada e aponte para o usuário e banco exclusivos de teste. A ponte piloto não usa o banco atual como alternativa. Mantenha `application.php` com `gateway_enabled` e `access_enabled` desligados até a homologação coordenada.

Nenhuma senha, token ou e-mail de conta de teste deve ser copiado para o GitHub. Não execute o bootstrap administrativo neste piloto.
