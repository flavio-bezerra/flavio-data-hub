# Banco de Dados HostGator — Casamento Victória & Flávio

## Informações de Conexão

| Item | Valor |
|------|-------|
| **Nome do Banco** | `hg8dcc78_casamento` |
| **Servidor** | `localhost` (ou IP do servidor HostGator) |
| **Usuário** | `hg8dcc78_casamento` (ou conforme criado no painel) |
| **Senha** | *(definida no painel HostGator — não versionar)* |
| **Charset** | `utf8mb4` |
| **Collation** | `utf8mb4_unicode_ci` |

## Localização
- **Provedor:** HostGator (hospedagem compartilhada / cloud)
- **Painel:** cPanel → Bancos de Dados MySQL®
- **Acesso externo:** Habilitar IP no "Remote MySQL" se necessário (Databricks, scripts locais, etc.)

## Uso no Projeto
Este banco armazenará:
- Lista de convidados (nomes, categorias, confirmações)
- Dados de RSVP / presença
- Configurações do site (textos, horários, endereços)
- Logs de acesso / auditoria

> ⚠️ **Segurança:** Credenciais reais ficam em variáveis de ambiente (`.env` local, segredos do Databricks/GitHub Actions). **Nunca** commitar senhas no Git.

## Scripts Relacionados
- `notebooks/criar-tabelas-casamento.sql` — DDL inicial
- `notebooks/popular-convidados-ficticios.py` — Seed para desenvolvimento
- `src/lib/db.ts` — Cliente de conexão (TypeScript)

## Backup
- HostGator faz backup automático diário (verificar retenção no plano)
- Export manual via phpMyAdmin ou `mysqldump` antes de deploys críticos

---
*Criado em 10/11/2026*