<?php
declare(strict_types=1);
function exigirAdministrador(PDO $db,int $accountId,bool $manage=false,bool $food=false): array {
    $stmt=$db->prepare('SELECT can_manage_administrators,can_read_food_data FROM administrators WHERE account_id=?');$stmt->execute([$accountId]);$admin=$stmt->fetch();
    if(!$admin||($manage&&!$admin['can_manage_administrators'])||($food&&!$admin['can_read_food_data']))throw new FalhaDeAcesso(403,'Acesso administrativo não autorizado.');
    return $admin;
}
