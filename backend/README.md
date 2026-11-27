# Backend Vercel — Victória & Flávio

Raiz do projeto Vercel: backend/. Node22+, npm ci neste diretório, separado do package-lock raiz do frontend. As APIs de pagamento existentes foram preservadas.

Acesso, sessão, Google, SMTP e OpenRouter executam na Vercel. MySQL executa na HostGator através de operações específicas em public/api/operacoes.php. O navegador usa URLs /api/*.php do próprio domínio, um gateway com cookie HttpOnly/Secure/SameSite=Lax. Não expõe o token da ponte ao navegador. Endpoint execute-sql aceita SQL arbitrário via token da ponte; usado pelo inicializador de schema fixo e diagnóstico. Não é usado para cadastro.

Instalação e homologação: docs/ativacao-vercel.md. Código antigo server/entrada-api.php está desativado; funções de banco PHP são reutilizadas na ponte, não como segundo sistema de login. Nada desta mudança ativa produção automaticamente. Migrações, arquivos privados e flags precisam instalação explícita.
