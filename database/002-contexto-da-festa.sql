-- Aplicar somente em banco de teste autorizado, após 001. Nenhum dado pessoal.
CREATE TABLE assistant_memory_versions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 behavior_text TEXT NOT NULL,
 knowledge_text TEXT NOT NULL,
 examples_text TEXT NOT NULL,
 created_by BIGINT UNSIGNED NOT NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (created_by) REFERENCES accounts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE assistant_publication (
 id TINYINT UNSIGNED PRIMARY KEY,
 memory_version_id BIGINT UNSIGNED NULL,
 revision INT UNSIGNED NOT NULL DEFAULT 0,
 published_by BIGINT UNSIGNED NULL,
 published_at DATETIME NULL,
 FOREIGN KEY (memory_version_id) REFERENCES assistant_memory_versions(id),
 FOREIGN KEY (published_by) REFERENCES accounts(id)
) ENGINE=InnoDB;
INSERT INTO assistant_publication (id) VALUES (1);
CREATE TABLE event_logistics_versions (
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
CREATE TABLE assistant_account_usage (
 account_id BIGINT UNSIGNED NOT NULL,
 window_id BIGINT UNSIGNED NOT NULL,
 attempts INT UNSIGNED NOT NULL,
 PRIMARY KEY(account_id,window_id),
 FOREIGN KEY(account_id) REFERENCES accounts(id)
) ENGINE=InnoDB;
