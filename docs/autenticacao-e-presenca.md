> Arquitetura atual: backend Node na Vercel + gateway/ponte PHP na HostGator. Veja docs/ativacao-vercel.md. Descrições de login/Google/SMTP/OpenRouter diretamente em PHP abaixo são históricas e substituídas; regras de produto permanecem. Backend e integrações ainda exigem homologação.

# Autenticação e cadastro por convite

## Estado — 16/11/2026
Implementação local parcial: núcleo PHP privado e telas /acesso criados. Migração NÃO executada; nenhuma conta real criada. Cadastro permanece desligado por registration_enabled=false e ausência de configuração privada. Frontend/RSVP existente permanece demonstrativo.

Código implementado: login por senha, hash nativo, sessões HttpOnly/SameSite, CSRF/origem, Google verifyIdToken + nonce/sub, verificação/recuperação por link de uso único, invalidando sessões ao trocar senha. Bootstrap CLI só para conta já verificada e banco sem administradores, email exclusivamente em configuração privada. Backend de vínculo atômico/consulta por responsável/confirmação por revision e prazo. Formulário /acesso com Google GIS, e-mail/senha, cadastro/verificação/recuperação; recusa acesso quando API ausente. Sem união automática Google/senha por igualdade de email. Vinculação explícita entre métodos de login permanece pendente.

Ainda pendentes: interface de vinculação e cadastro de grupo, substituir RSVP demonstrativo por fluxo real, painel CRUD/admin/transferência/exportação, endpoints e telas alimentares/consentimento/exclusão agendada, documentação completa de contrato e integração. server/administracao.php nesta etapa contém apenas o guard de permissão, não o painel. Bibliotecas Composer declaradas mas não instaladas; composer.lock pendente. SMTP/Google/MySQL não homologados. PHP local não instalado; nenhuma configuração global alterada.

Verificações desta etapa: TypeScript/lint/build aprovados (0 erros/7 avisos existentes); sintaxe de 10 novos PHP validada em PHP8.2 isolado no sandbox. HTTP das3 entradas sem backend privado retorna503/no-store e nenhum dado pessoal. Servidor sandbox encerrado ao fim. Esses testes NÃO validam login real, banco, emails, concorrência MySQL nem sessão autenticada. Inspeção visual /acesso ainda pendente.

## Privacidade do administrador inicial
O email real do administrador inicial não deve constar em código, exemplos, documentação, migrações SQL ou variáveis VITE_. Preencher bootstrap_admin_email somente em configuração privada fora de public_html. Bootstrap implementado em server/bootstrap-administrador.php, CLI com --confirmar, apenas para iniciar a conta administrativa após verificação; não foi executado. Não conceder privilégios automaticamente pelo cadastro público. Contas Google devem ser vinculadas pelo sub validado, não por email recebido do navegador. Vinculação com conta de senha existente requer prova de controle, sem associação automática apenas por igualdade de emails.

## Regras autorizadas
Login Google ou email/senha com verificação e recuperação. Primeira conta autenticada que confirmar explicitamente o vínculo do código torna-se responsável pelo grupo; vinculação atômica, sem sobrescrever responsável. Só responsável edita grupo; transferência por administrador. Código não permite leitura de grupo já vinculado por outra conta. Prazo de resposta configurável.

Alergias/intolerâncias e preferências alimentares são opcionais; tipo sanguíneo excluído. Consentimento específico individual para adulto por link, sem assumir convite; responsável legal por menores. Não persistir alergias de outro adulto antes da autorização. Acesso alimentar restrito ao responsável e administradores com permissão separada; exportação mínima para buffet. Exclusão antecipada permitida e automática30 dias após evento. Payload alimentar criptografado com chave fora do banco/Git; logs sem conteúdo sensível. Exclusão deve alcançar dados temporários e definir política de backups antes de produção.

## Instalação privada
server/config.example.php contém campos vazios e placeholders. Configuração real deve permanecer fora da raiz pública, não enviada com o build Vite. A migração contém apenas estrutura e configuração do evento, nenhum usuário real. Não foi homologada em MySQL nesta etapa. É necessário confirmar versão PHP, PDO MySQL, OpenSSL, Sodium, Composer, SMTP e cron. Google OAuth, MySQL e emails reais ainda não configurados. Sem commit, push ou deploy.
