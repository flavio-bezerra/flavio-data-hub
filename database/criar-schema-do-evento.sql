-- ============================================================
-- Cria o schema inicial do portal (migracoes 001-006), sem convidados.
--
-- USO SEGURO:
-- 1. Confirme que DATABASE() e exatamente o banco configurado em
--    /home2/hg8dcc78/casamento-private/database.php.
-- 2. Faça backup antes de executar.
-- 3. Execute apenas se o verificador indicar que as tabelas do portal estao
--    ausentes. Este script nao apaga tabelas nem dados existentes.
--
-- CREATE TABLE IF NOT EXISTS e INSERT IGNORE permitem repeticao quando as
-- tabelas ja possuem exatamente este schema. Eles NAO atualizam uma tabela
-- existente com colunas antigas; se houver instalacao parcial, pare e planeje
-- ALTERs especificos em vez de confiar no IF NOT EXISTS.
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 001 — presença, autenticação e administração
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    display_name VARCHAR(160) NOT NULL,
    password_hash VARCHAR(255) NULL,
    google_subject VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NULL,
    email_verified_at DATETIME NULL,
    session_version INT UNSIGNED NOT NULL DEFAULT 0,
    disabled_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY accounts_email_unique (email),
    UNIQUE KEY accounts_google_subject_unique (google_subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS administrators (
    account_id BIGINT UNSIGNED PRIMARY KEY,
    can_manage_administrators BOOLEAN NOT NULL DEFAULT FALSE,
    can_read_food_data BOOLEAN NOT NULL DEFAULT FALSE,
    granted_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (granted_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invitation_groups (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(160) NOT NULL,
    invitation_token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    responsible_account_id BIGINT UNSIGNED NULL,
    claimed_at DATETIME NULL,
    revoked_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    external_invitation_id VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NULL,
    import_fingerprint CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NULL,
    contact_phone VARCHAR(16) NULL,
    registration_receipt CHAR(32) CHARACTER SET ascii COLLATE ascii_bin NULL,
    registration_confirmed_at DATETIME NULL,
    lodging_intent ENUM('undecided','no','yes') NOT NULL DEFAULT 'undecided',
    hotel_name VARCHAR(160) NULL,
    arrival_mode ENUM('undecided','car','app','van') NOT NULL DEFAULT 'undecided',
    table_number SMALLINT UNSIGNED NULL,
    table_visible BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp_contacted_at DATETIME NULL,
    UNIQUE KEY invitation_token_hash_unique (invitation_token_hash),
    UNIQUE KEY invitation_external_unique (external_invitation_id),
    UNIQUE KEY invitation_receipt_unique (registration_receipt),
    INDEX idx_invitation_table (table_number),
    FOREIGN KEY (responsible_account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS guests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invitation_group_id BIGINT UNSIGNED NOT NULL,
    display_name VARCHAR(160) NOT NULL,
    is_minor BOOLEAN NOT NULL DEFAULT FALSE,
    attendance ENUM('pending', 'yes', 'no') NOT NULL DEFAULT 'pending',
    revision INT UNSIGNED NOT NULL DEFAULT 0,
    updated_by BIGINT UNSIGNED NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    contact_phone VARCHAR(16) NULL,
    arrival_override ENUM('undecided','car','app','van') NULL,
    FOREIGN KEY (invitation_group_id) REFERENCES invitation_groups(id),
    FOREIGN KEY (updated_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS account_action_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT UNSIGNED NOT NULL,
    purpose ENUM('verify_email', 'reset_password') NOT NULL,
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    expires_at DATETIME NOT NULL,
    consumed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY account_action_token_unique (token_hash),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS food_authorizations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    guest_id BIGINT UNSIGNED NOT NULL,
    requested_by BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    purpose_version VARCHAR(40) NOT NULL,
    expires_at DATETIME NOT NULL,
    authorized_at DATETIME NULL,
    guardian_account_id BIGINT UNSIGNED NULL,
    withdrawn_at DATETIME NULL,
    consumed_at DATETIME NULL,
    UNIQUE KEY food_authorization_token_unique (token_hash),
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    FOREIGN KEY (requested_by) REFERENCES accounts(id),
    FOREIGN KEY (guardian_account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS guest_food_information (
    guest_id BIGINT UNSIGNED PRIMARY KEY,
    authorization_id BIGINT UNSIGNED NOT NULL,
    encrypted_payload MEDIUMBLOB NOT NULL,
    updated_by BIGINT UNSIGNED NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delete_after DATETIME NOT NULL,
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    FOREIGN KEY (authorization_id) REFERENCES food_authorizations(id),
    FOREIGN KEY (updated_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS event_settings (
    id TINYINT UNSIGNED PRIMARY KEY,
    event_at DATETIME NOT NULL,
    response_deadline DATETIME NULL,
    food_retention_days SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    revision INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_account_id BIGINT UNSIGNED NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(40) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS access_rate_limits (
    bucket_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    window_id BIGINT UNSIGNED NOT NULL,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket_hash, window_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 002 — contexto do evento e assistente
CREATE TABLE IF NOT EXISTS assistant_memory_versions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    behavior_text TEXT NOT NULL,
    knowledge_text TEXT NOT NULL,
    examples_text TEXT NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assistant_publication (
    id TINYINT UNSIGNED PRIMARY KEY,
    memory_version_id BIGINT UNSIGNED NULL,
    revision INT UNSIGNED NOT NULL DEFAULT 0,
    published_by BIGINT UNSIGNED NULL,
    published_at DATETIME NULL,
    FOREIGN KEY (memory_version_id) REFERENCES assistant_memory_versions(id),
    FOREIGN KEY (published_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS event_logistics_versions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    topic ENUM('event','hotel','van','table') NOT NULL,
    title VARCHAR(160) NOT NULL,
    details_text TEXT NOT NULL,
    link_url VARCHAR(1000) NULL,
    invitation_group_id BIGINT UNSIGNED NULL,
    guest_id BIGINT UNSIGNED NULL,
    published_at DATETIME NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_group_id) REFERENCES invitation_groups(id),
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    FOREIGN KEY (created_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assistant_account_usage (
    account_id BIGINT UNSIGNED NOT NULL,
    window_id BIGINT UNSIGNED NOT NULL,
    attempts INT UNSIGNED NOT NULL,
    PRIMARY KEY (account_id, window_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 003 — sessões e ponte
CREATE TABLE IF NOT EXISTS web_access_sessions (
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    account_id BIGINT UNSIGNED NULL,
    account_session_version INT UNSIGNED NULL,
    csrf_token CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    google_nonce CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at DATETIME NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    INDEX sessions_account (account_id),
    INDEX sessions_expiration (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 004 — importação de convites
CREATE TABLE IF NOT EXISTS invitation_import_stage (
    row_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_convite VARCHAR(80) NOT NULL,
    grupo_familia VARCHAR(160) NOT NULL,
    nome VARCHAR(160) NOT NULL,
    id_pessoa VARCHAR(80) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 005 — comunicados por e-mail
CREATE TABLE IF NOT EXISTS event_email_dispatches (
    dispatch_id CHAR(36) CHARACTER SET ascii PRIMARY KEY,
    actor_account_id BIGINT UNSIGNED NOT NULL,
    recipient_count SMALLINT UNSIGNED NOT NULL,
    state ENUM('reserved','completed','partial') NOT NULL DEFAULT 'reserved',
    accepted_count SMALLINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sementes tecnicas; nao insere contas, convidados ou dados pessoais.
INSERT IGNORE INTO event_settings (id, event_at, response_deadline, food_retention_days)
VALUES (1, '2027-10-10 16:30:00', NULL, 30);

INSERT IGNORE INTO assistant_publication (id)
VALUES (1);

SELECT 'Schema inicial criado/verificado. Rode verificar-migracoes-producao.sql antes do deploy.' AS status;
