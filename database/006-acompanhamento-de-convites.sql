-- Aplicar após 005, primeiro em homologação. Não contém dados de contato.
ALTER TABLE invitation_groups ADD COLUMN whatsapp_contacted_at DATETIME NULL;
