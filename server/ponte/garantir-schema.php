<?php
declare(strict_types=1);

/**
 * Cria tabelas ausentes uma vez, sob lock MySQL.
 * Não altera tabelas existentes: um schema parcial/incompatível falha fechado.
 * Este arquivo só é chamado depois da validação do X-Bridge-Token no gateway.
 */
function estadoDoSchemaDoEvento(PDO $db): array
{
    $colunasEsperadas = [
        'accounts' => ['id','email','display_name','password_hash','google_subject','email_verified_at','session_version','disabled_at','created_at'],
        'administrators' => ['account_id','can_manage_administrators','can_read_food_data','granted_by','created_at'],
        'invitation_groups' => ['id','label','invitation_token_hash','responsible_account_id','claimed_at','revoked_at','created_at','external_invitation_id','import_fingerprint','contact_phone','registration_receipt','registration_confirmed_at','lodging_intent','hotel_name','arrival_mode','table_number','table_visible','whatsapp_contacted_at'],
        'guests' => ['id','invitation_group_id','display_name','is_minor','attendance','revision','updated_by','updated_at','contact_phone','arrival_override'],
        'account_action_tokens' => ['id','account_id','purpose','token_hash','expires_at','consumed_at','created_at'],
        'food_authorizations' => ['id','guest_id','requested_by','token_hash','purpose_version','expires_at','authorized_at','guardian_account_id','withdrawn_at','consumed_at'],
        'guest_food_information' => ['guest_id','authorization_id','encrypted_payload','updated_by','updated_at','delete_after'],
        'event_settings' => ['id','event_at','response_deadline','food_retention_days','revision'],
        'audit_events' => ['id','actor_account_id','action','entity_type','entity_id','created_at'],
        'access_rate_limits' => ['bucket_hash','window_id','attempts'],
        'assistant_memory_versions' => ['id','behavior_text','knowledge_text','examples_text','created_by','created_at'],
        'assistant_publication' => ['id','memory_version_id','revision','published_by','published_at'],
        'event_logistics_versions' => ['id','topic','title','details_text','link_url','invitation_group_id','guest_id','published_at','created_by','created_at'],
        'assistant_account_usage' => ['account_id','window_id','attempts'],
        'web_access_sessions' => ['token_hash','account_id','account_session_version','csrf_token','google_nonce','expires_at','created_at','revoked_at'],
        'invitation_import_stage' => ['row_id','id_convite','grupo_familia','nome','id_pessoa'],
        'event_email_dispatches' => ['dispatch_id','actor_account_id','recipient_count','state','accepted_count','created_at'],
    ];
    $indicesEsperados = [
        'accounts' => ['accounts_email_unique','accounts_google_subject_unique'],
        'invitation_groups' => ['invitation_token_hash_unique','invitation_external_unique','invitation_receipt_unique','idx_invitation_table'],
        'account_action_tokens' => ['account_action_token_unique'],
        'food_authorizations' => ['food_authorization_token_unique'],
        'web_access_sessions' => ['sessions_account','sessions_expiration'],
    ];

    $tabelas = array_keys($colunasEsperadas);
    $placeholders = implode(',', array_fill(0, count($tabelas), '?'));
    $stmt = $db->prepare('SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME IN ('.$placeholders.')');
    $stmt->execute($tabelas);
    $presentes = array_fill_keys($stmt->fetchAll(PDO::FETCH_COLUMN), true);
    $faltamTabelas = array_values(array_diff($tabelas, array_keys($presentes)));
    $faltamColunas = [];
    $faltamIndices = [];
    $tabelasExistentes = array_keys($presentes);

    if ($tabelasExistentes) {
        $ph = implode(',', array_fill(0, count($tabelasExistentes), '?'));
        $stmt = $db->prepare('SELECT TABLE_NAME,COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME IN ('.$ph.')');
        $stmt->execute($tabelasExistentes);
        $colunasPresentes = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) $colunasPresentes[$row['TABLE_NAME']][$row['COLUMN_NAME']] = true;

        foreach ($tabelasExistentes as $tabela) {
            foreach ($colunasEsperadas[$tabela] as $coluna) {
                if (!isset($colunasPresentes[$tabela][$coluna])) $faltamColunas[] = $tabela.'.'.$coluna;
            }
        }

        $stmt = $db->prepare('SELECT TABLE_NAME,INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME IN ('.$ph.')');
        $stmt->execute($tabelasExistentes);
        $indicesPresentes = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) $indicesPresentes[$row['TABLE_NAME']][$row['INDEX_NAME']] = true;

        foreach ($indicesEsperados as $tabela => $indices) {
            if (!isset($presentes[$tabela])) continue;
            foreach ($indices as $indice) {
                if (!isset($indicesPresentes[$tabela][$indice])) $faltamIndices[] = $tabela.'.'.$indice;
            }
        }
    }

    return [
        'missing_tables' => $faltamTabelas,
        'missing_columns' => $faltamColunas,
        'missing_indexes' => $faltamIndices,
    ];
}

function garantirSchemaDoEvento(PDO $db): void
{
    static $prontoNestaRequisicao = false;
    if ($prontoNestaRequisicao) return;

    $estado = estadoDoSchemaDoEvento($db);
    if (!$estado['missing_tables'] && !$estado['missing_columns'] && !$estado['missing_indexes']) {
        $prontoNestaRequisicao = true;
        return;
    }
    if ($estado['missing_columns'] || $estado['missing_indexes']) {
        throw new RuntimeException('Schema parcial: CREATE IF NOT EXISTS nao altera tabelas ou indices existentes.');
    }

    $lock = $db->prepare("SELECT GET_LOCK('vf_schema_init_001_006', 20)");
    $lock->execute();
    if ((int)$lock->fetchColumn() !== 1) throw new RuntimeException('Nao foi possivel obter lock para inicializar o schema.');

    try {
        $estado = estadoDoSchemaDoEvento($db);
        if (!$estado['missing_tables'] && !$estado['missing_columns'] && !$estado['missing_indexes']) {
            $prontoNestaRequisicao = true;
            return;
        }
        if ($estado['missing_columns'] || $estado['missing_indexes']) {
            throw new RuntimeException('Schema parcial detectado; inicializacao automatica cancelada.');
        }

        $arquivo = dirname(__DIR__).'/schema-do-evento.sql';
        $sql = file_get_contents($arquivo);
        if (!is_string($sql) || $sql === '') throw new RuntimeException('Arquivo de schema indisponivel.');
        $linhas = preg_split('/\R/', $sql);
        if (!is_array($linhas)) throw new RuntimeException('Nao foi possivel ler o arquivo de schema.');
        $linhas = array_filter($linhas, static fn(string $linha): bool => !preg_match('/^\s*--/', $linha));
        $sql = implode("\n", $linhas);
        foreach (explode(';', $sql) as $statement) {
            $statement = trim($statement);
            if ($statement === '' || preg_match('/^SELECT\b/i', $statement)) continue;
            $db->exec($statement);
        }

        $estado = estadoDoSchemaDoEvento($db);
        if ($estado['missing_tables'] || $estado['missing_columns'] || $estado['missing_indexes']) {
            throw new RuntimeException('Schema continua incompleto apos CREATE IF NOT EXISTS.');
        }
        $prontoNestaRequisicao = true;
    } finally {
        $db->query("SELECT RELEASE_LOCK('vf_schema_init_001_006')")->fetchColumn();
    }
}
