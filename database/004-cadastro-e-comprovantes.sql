-- Aplicar uma vez, somente no banco piloto após backup. DDL MySQL tem commit implícito.
ALTER TABLE invitation_groups
    ADD COLUMN external_invitation_id VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NULL,
    ADD COLUMN import_fingerprint CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NULL,
    ADD COLUMN contact_phone VARCHAR(16) NULL,
    ADD COLUMN registration_receipt CHAR(32) CHARACTER SET ascii COLLATE ascii_bin NULL,
    ADD COLUMN registration_confirmed_at DATETIME NULL,
    ADD UNIQUE KEY invitation_external_unique(external_invitation_id),
    ADD UNIQUE KEY invitation_receipt_unique(registration_receipt);

ALTER TABLE guests ADD COLUMN contact_phone VARCHAR(16) NULL;

CREATE TABLE invitation_import_stage (
    row_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_convite VARCHAR(80) NOT NULL,
    grupo_familia VARCHAR(160) NOT NULL,
    nome VARCHAR(160) NOT NULL,
    id_pessoa VARCHAR(80) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
