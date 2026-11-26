-- Aplicar somente após 004, com backup, no banco exclusivo do casamento.
ALTER TABLE invitation_groups
  ADD COLUMN lodging_intent ENUM('undecided','no','yes') NOT NULL DEFAULT 'undecided',
  ADD COLUMN hotel_name VARCHAR(160) NULL,
  ADD COLUMN arrival_mode ENUM('undecided','car','app','van') NOT NULL DEFAULT 'undecided',
  ADD COLUMN table_number SMALLINT UNSIGNED NULL,
  ADD COLUMN table_visible BOOLEAN NOT NULL DEFAULT FALSE,
  ADD INDEX idx_invitation_table (table_number);
ALTER TABLE guests ADD COLUMN arrival_override ENUM('undecided','car','app','van') NULL;
CREATE TABLE event_email_dispatches (
  dispatch_id CHAR(36) CHARACTER SET ascii PRIMARY KEY,
  actor_account_id BIGINT UNSIGNED NOT NULL,
  recipient_count SMALLINT UNSIGNED NOT NULL,
  state ENUM('reserved','completed','partial') NOT NULL DEFAULT 'reserved',
  accepted_count SMALLINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_account_id) REFERENCES accounts(id)
) ENGINE=InnoDB;
