-- MySQL 8+ / InnoDB. Executar apenas em banco de teste autorizado.
-- Não contém convidados, administradores ou credenciais reais.
CREATE TABLE accounts (
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

CREATE TABLE administrators (
    account_id BIGINT UNSIGNED PRIMARY KEY,
    can_manage_administrators BOOLEAN NOT NULL DEFAULT FALSE,
    can_read_food_data BOOLEAN NOT NULL DEFAULT FALSE,
    granted_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (granted_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE invitation_groups (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(160) NOT NULL,
    invitation_token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    responsible_account_id BIGINT UNSIGNED NULL,
    claimed_at DATETIME NULL,
    revoked_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY invitation_token_hash_unique (invitation_token_hash),
    FOREIGN KEY (responsible_account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE guests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invitation_group_id BIGINT UNSIGNED NOT NULL,
    display_name VARCHAR(160) NOT NULL,
    is_minor BOOLEAN NOT NULL DEFAULT FALSE,
    attendance ENUM('pending', 'yes', 'no') NOT NULL DEFAULT 'pending',
    revision INT UNSIGNED NOT NULL DEFAULT 0,
    updated_by BIGINT UNSIGNED NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invitation_group_id) REFERENCES invitation_groups(id),
    FOREIGN KEY (updated_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE account_action_tokens (
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

CREATE TABLE food_authorizations (
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

CREATE TABLE guest_food_information (
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

CREATE TABLE event_settings (
    id TINYINT UNSIGNED PRIMARY KEY,
    event_at DATETIME NOT NULL,
    response_deadline DATETIME NULL,
    food_retention_days SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    revision INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE audit_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_account_id BIGINT UNSIGNED NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(40) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_account_id) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Remover janelas antigas periodicamente na rotina de manutenção.
CREATE TABLE access_rate_limits (
    bucket_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    window_id BIGINT UNSIGNED NOT NULL,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket_hash, window_id)
) ENGINE=InnoDB;

-- Datas em UTC; evento às 13h30 no fuso America/Sao_Paulo.
INSERT INTO event_settings (id, event_at, response_deadline, food_retention_days)
VALUES (1, '2027-10-10 16:30:00', NULL, 30);
