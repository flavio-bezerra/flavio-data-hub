# Assistente da festa e memória administrativa

Implementação LOCAL, sem chave, chamadas OpenRouter, migrações ou deploy. Cadastro/auth anterior parcial permanece não homologado; painel desta entrega é específico ao assistente, não substitui painel completo de convidados.

## Acesso e contexto
PHP exige conta verificada/sessão válida, CSRF e origem antes do chat e dos cadastros administrativos. Contexto é filtrado no SQL por responsável ativo: registros gerais publicados, dados de presença do grupo e logística individual pertencente ao grupo. Não consulta alergias, contas, CPF, pagamentos ou códigos de convite. Mesmo administrador recebe contexto de convidado restrito ao seu grupo para a prévia do chat. Usuário sem grupo recebe apenas registros gerais. IA somente leitura, sem ferramenta SQL ou ações.

Informações gerais cadastradas pelo administrador devem ser exclusivamente conteúdo público do evento. Mesa exige grupo; atribuições de hotel/van podem ser gerais ou específicas. Um registro para convidado exige conferência de grupo. Retirar publicação remove uso em novas chamadas; evitar inserir nomes/dados privados no texto geral.

## Memória
/administracao/assistente: comportamento, conhecimento e exemplos; salvar sempre cria versão imutável. Publicação usa revisão para detectar concorrência. Restaurar é republicar versão anterior. Registro de autor/data no banco e auditoria de publicação. Editor nunca altera permissões PHP. Prévia usa versão salva, somente administrador. Histórico limitado às30 versões mais recentes na UI; registros100 na UI. Paginação e edição mais elaborada de hotéis/mesas/rotas ficam pendentes.

## OpenRouter
Configurar chave só em server/config.private.php fora de public_html e Git. enabled=false por padrão; ausência de chave retorna503. Modelo de teste nvidia/nemotron-3.5-lightning:free, SOMENTE dados fictícios. Antes de cadastro real: desligar fictional_data_only, escolher modelo pago e revisar provedor/privacidade; gate bloqueia :free e falta de revisão. Rotas de dados reais exigem provider.data_collection=deny e zdr=true, sem relaxamento automático. Isso não substitui revisão de termos, aviso de privacidade e medidas contra envio de dados sensíveis na pergunta livre. Não prometer que dados nunca saem: contexto e perguntas são processados pelo OpenRouter/provedor.

## Conversas e limites
Somente memória React; nenhum texto de conversa no MySQL ou logs da aplicação. 30 chamadas/conta/hora além do limite IP existente; máximo12 mensagens/18000bytes, resposta700 tokens, timeout40s e sem retry automático. Limpar após logout/troca de conta/evento de sessão; atualização de sessão a cada60s e foco. Expiração descoberta no servidor limpa na próxima atualização. Fontes retornadas são registros disponíveis para a resposta, não uma comprovação de que o modelo citou todos corretamente. Renderização é texto React sem HTML do modelo. Qualidade/citações ainda exigem avaliação real.

## Instalação e verificação
Executar002 após001 somente em MySQL de teste autorizado. Requer cURL TLS e Composer do PHP8.2+. Não executar cron, emails ou pagamentos nesta entrega. Homologação de isolamento MySQL, UI, backend autenticado, publicação/concorrência e qualidade do modelo ainda pendentes. Não publicar chaves ou dados reais nas migrações.

Validação16/11: TypeScript/lint/build exit0 (7avisos FastRefresh existentes e Browserslist antigo). Sintaxe PHP nova aprovada em sandbox PHP8.2. Fixture SQLite fictícia aprovou memória publicada vs rascunho, contexto próprio/geral, bloqueio outrogrupo/revogado/guest incompatível, conta sem grupo, transferência de responsável, prévia só admin, login obrigatório, ausência de chave, bloqueio :free para dados reais e origem inválida. SQLite não valida transações, migração ou concorrência MySQL. Nenhuma chamada OpenRouter nem resposta real/simulada de modelo apresentada como homologada. Inspeção visual desktop/mobile, foco e logout no navegador ainda pendentes.

Limitações iniciais: seleção logística administrativa usa IDs de grupo/convidado, não seletor por nome; paginação de registros e histórico a ampliar. Textos gerais e perguntas livres podem conter dados pessoais se inseridos manualmente: o modo fictício é um compromisso explícito de implantação, não um detector de PII. Antes de uso real, revisar consentimento, privacidade e tratamento de texto livre. História enviada pelo navegador é conteúdo não confiável e nunca autorização; não há ferramentas de execução do modelo. Revalidação SQL não revoga o texto já exibido no navegador ou enviado em mensagens anteriores: antes de transferências de grupo, prever limpeza de histórico por versão do vínculo. Uso administrativo da prévia não inclui cadastro global de convidados.
