<?php
declare(strict_types=1);

/**
 * Flags operacionais versionadas. Nenhuma senha, token ou e-mail pessoal aqui.
 * O .htaccess da pasta bloqueia acesso HTTP direto a este arquivo.
 * Credenciais ficam em /home2/hg8dcc78/casamento-private/{bridge,database}.php.
 */
return [
    'gateway_enabled' => true,
    'access_enabled' => true,
    'access_environment' => 'event',
    'bootstrap_admin_email' => '',
];
