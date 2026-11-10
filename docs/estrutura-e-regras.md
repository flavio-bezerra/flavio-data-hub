# Site de casamento de Victória & Flávio

## Escopo aprovado
Página principal com abertura, história, local/horários, orientações, presentes simbólicos e presença. Identidade clássica do convite preservada. RSVP por família/grupo com confirmação individual. Desenvolvimento e validação local antes da publicação.

## Arquitetura
React 18, TypeScript, Vite 7, Tailwind 3, shadcn. A rota / reúne as seções em src/pages/SaveTheDate.tsx. Conteúdo factual centralizado em src/features/casamento/conteudo.ts. Componentes por domínio: casamento, presentes e presenca. Rota /convite/:codigo para a confirmação individual. Código de portfólio removido por autorização: projeto exclusivo do casamento.

## Identidade e layout
Fundo claro, Cormorant Garamond para títulos, Montserrat para interface e Great Vibes como detalhe. Champagne para divisores e uma versão escura para ações com contraste. Abertura mostra nomes, data, horário, cidade, local e presença antes da citação. História aguarda texto/foto aprovados. Navegação móvel em fluxo, sem overlay, e perguntas frequentes em acordeão.

## Dados confirmados
Victória & Flávio; 10 de outubro de 2027, domingo, 14h, fuso America/Sao_Paulo; DellaTorres Eventos; Mairiporã/SP; recepção no mesmo local.

## Requisitos funcionais
FR-001: Quando acessar /, o site deve mostrar o evento e permitir navegação às seis áreas aprovadas.
FR-002: Quando acessar um convite válido de demonstração, o site deve mostrar somente as pessoas fictícias daquele convite.
FR-003: Quando tentar salvar respostas incompletas, o site deve pedir uma resposta por pessoa.
FR-004: Quando completar as respostas, o protótipo deve mostrar resultado de demonstração sem enviar dados ao servidor.
FR-005: Enquanto pagamento não estiver configurado, o site deve exibir itens e valores como ilustrativos e manter cobrança desabilitada.
FR-006: Quando uma informação não estiver confirmada, o site deve identificá-la como pendente ou em breve.

## Requisitos não funcionais
Layout a partir de 320px sem rolagem horizontal; teclado e foco visível; alvos de toque >=44px; contraste AA; hierarquia semântica; respeitar movimento reduzido. Dados reais de convidados e códigos ficam fora do frontend. Pagamento real exige API de checkout e webhook autenticado e idempotente. A configuração de publicação mantém segredos fora do código.

## Aceite da demonstração
Dado /, ao usar o menu, a seção correspondente aparece sem ficar oculta pelo cabeçalho.
Dado um código inválido, ao abrir o convite, aparece feedback com acesso à demonstração.
Dado /convite/demonstracao, ao salvar respostas incompletas, aparece erro recuperável.
Dadas respostas completas, ao salvar, aparece sucesso restrito à demonstração.
Dado um presente ilustrativo, ao tentar pagar, não existe cobrança habilitada.
Dado o retorno ao site a partir do convite, a navegação deve chegar à seção de presença.

## Erros e recuperação
| Condição | Resposta |
|---|---|
| Código inválido | Orientar para demonstração, sem expor dados |
| Resposta parcial | Solicitar resposta para cada pessoa e preservar escolhas |
| Pagamento sem provedor | Botão desabilitado e indicação de prévia |
| Conteúdo pendente | Exibir em definição/em breve |

## Próximas etapas
Aprovar layout, texto e fotos; definir dia/ano do prazo em fevereiro, traje, endereço, crianças e acompanhantes; escolher backend e administração; escolher provedor, taxas, meios de pagamento, cotas e reembolso; implementar persistência e webhook; validar publicação e rollback.

## Publicação
O usuário autorizou commit/push pelo notebook Databricks e publicação automática da prévia após push na main. O workflow mantém workflow_dispatch e exige TypeScript, lint e build aprovados antes do FTP. A aprovação visual e os testes locais antecedem cada push destinado à publicação. Consulte agents/publicacao.md e docs/entrega-databricks.md. Upload, aplicação na pasta Git e push são etapas distintas.
