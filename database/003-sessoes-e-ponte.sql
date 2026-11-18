-- Executar depois de 001 e 002 em banco de TESTE autorizado. Sem usuários/segredos.
CREATE TABLE web_access_sessions (
 token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 account_id BIGINT UNSIGNED NULL,
 account_session_version INT UNSIGNED NULL,
 csrf_token CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 google_nonce CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 expires_at DATETIME NOT NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 revoked_at DATETIME NULL,
 FOREIGN KEY (account_id) REFERENCES accounts(id),
 INDEX sessions_account(account_id), INDEX sessions_expiration(expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
