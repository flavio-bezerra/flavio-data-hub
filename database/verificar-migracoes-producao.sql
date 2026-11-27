-- Verificacao SOMENTE-LEITURA das migracoes de schema 004, 005 e 006.
--
-- No phpMyAdmin, selecione primeiro o banco apontado por
-- /home2/hg8dcc78/casamento-private/database.php e execute este arquivo.
-- Este SQL consulta apenas information_schema; nao altera tabelas nem dados.
--
-- Resultado esperado: todas as linhas com status = 'ok'.
-- Se houver 'FALTA', nao envie server/ ainda e nao reaplique arquivos inteiros
-- sem conferir o estado: ALTER TABLE nao e idempotente e o MySQL pode ter
-- aplicado parte de uma migracao anterior.

-- Compare este resultado localmente com a chave `database` de database.php.
SELECT DATABASE() AS banco_selecionado;

-- Objetos de tabela das migracoes 004 e 005.
SELECT e.migracao, e.objeto,
       IF(t.TABLE_NAME IS NULL, 'FALTA', 'ok') AS status
FROM (
    SELECT '004' AS migracao, 'invitation_import_stage' AS objeto
    UNION ALL SELECT '005', 'event_email_dispatches'
) AS e
LEFT JOIN information_schema.TABLES AS t
       ON t.TABLE_SCHEMA = DATABASE()
      AND t.TABLE_NAME = e.objeto
ORDER BY e.migracao, e.objeto;

-- Colunas exigidas pelas migracoes 004, 005 e 006.
SELECT e.migracao, CONCAT(e.tabela, '.', e.coluna) AS objeto,
       IF(c.COLUMN_NAME IS NULL, 'FALTA', 'ok') AS status
FROM (
    SELECT '004' AS migracao, 'invitation_groups' AS tabela, 'external_invitation_id' AS coluna
    UNION ALL SELECT '004', 'invitation_groups', 'import_fingerprint'
    UNION ALL SELECT '004', 'invitation_groups', 'contact_phone'
    UNION ALL SELECT '004', 'invitation_groups', 'registration_receipt'
    UNION ALL SELECT '004', 'invitation_groups', 'registration_confirmed_at'
    UNION ALL SELECT '004', 'guests', 'contact_phone'
    UNION ALL SELECT '004', 'invitation_import_stage', 'row_id'
    UNION ALL SELECT '004', 'invitation_import_stage', 'id_convite'
    UNION ALL SELECT '004', 'invitation_import_stage', 'grupo_familia'
    UNION ALL SELECT '004', 'invitation_import_stage', 'nome'
    UNION ALL SELECT '004', 'invitation_import_stage', 'id_pessoa'
    UNION ALL SELECT '005', 'invitation_groups', 'lodging_intent'
    UNION ALL SELECT '005', 'invitation_groups', 'hotel_name'
    UNION ALL SELECT '005', 'invitation_groups', 'arrival_mode'
    UNION ALL SELECT '005', 'invitation_groups', 'table_number'
    UNION ALL SELECT '005', 'invitation_groups', 'table_visible'
    UNION ALL SELECT '005', 'guests', 'arrival_override'
    UNION ALL SELECT '005', 'event_email_dispatches', 'dispatch_id'
    UNION ALL SELECT '005', 'event_email_dispatches', 'actor_account_id'
    UNION ALL SELECT '005', 'event_email_dispatches', 'recipient_count'
    UNION ALL SELECT '005', 'event_email_dispatches', 'state'
    UNION ALL SELECT '005', 'event_email_dispatches', 'accepted_count'
    UNION ALL SELECT '006', 'invitation_groups', 'whatsapp_contacted_at'
) AS e
LEFT JOIN information_schema.COLUMNS AS c
       ON c.TABLE_SCHEMA = DATABASE()
      AND c.TABLE_NAME = e.tabela
      AND c.COLUMN_NAME = e.coluna
ORDER BY e.migracao, e.tabela, e.coluna;

-- Indices exigidos pelas migracoes 004 e 005.
SELECT e.migracao, CONCAT(e.tabela, '.', e.indice) AS objeto,
       IF(s.INDEX_NAME IS NULL, 'FALTA', 'ok') AS status
FROM (
    SELECT '004' AS migracao, 'invitation_groups' AS tabela, 'invitation_external_unique' AS indice
    UNION ALL SELECT '004', 'invitation_groups', 'invitation_receipt_unique'
    UNION ALL SELECT '005', 'invitation_groups', 'idx_invitation_table'
) AS e
LEFT JOIN (
    SELECT DISTINCT TABLE_SCHEMA, TABLE_NAME, INDEX_NAME
    FROM information_schema.STATISTICS
) AS s
       ON s.TABLE_SCHEMA = DATABASE()
      AND s.TABLE_NAME = e.tabela
      AND s.INDEX_NAME = e.indice
ORDER BY e.migracao, e.tabela, e.indice;

-- Tabelas-base exigidas pelas migracoes 001, 002 e 003.
SELECT e.migracao, e.tabela AS objeto,
       IF(t.TABLE_NAME IS NULL, 'FALTA', 'ok') AS status
FROM (
    SELECT '001' AS migracao, 'accounts' AS tabela
    UNION ALL SELECT '001', 'administrators'
    UNION ALL SELECT '001', 'invitation_groups'
    UNION ALL SELECT '001', 'guests'
    UNION ALL SELECT '001', 'account_action_tokens'
    UNION ALL SELECT '001', 'food_authorizations'
    UNION ALL SELECT '001', 'guest_food_information'
    UNION ALL SELECT '001', 'event_settings'
    UNION ALL SELECT '001', 'audit_events'
    UNION ALL SELECT '001', 'access_rate_limits'
    UNION ALL SELECT '002', 'assistant_memory_versions'
    UNION ALL SELECT '002', 'assistant_publication'
    UNION ALL SELECT '002', 'event_logistics_versions'
    UNION ALL SELECT '002', 'assistant_account_usage'
    UNION ALL SELECT '003', 'web_access_sessions'
) AS e
LEFT JOIN information_schema.TABLES AS t
       ON t.TABLE_SCHEMA = DATABASE()
      AND t.TABLE_NAME = e.tabela
ORDER BY e.migracao, e.tabela;

-- Contagem total apenas como informacao auxiliar; nao substitui as checagens acima.
SELECT COUNT(*) AS total_de_tabelas_no_banco
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE();
