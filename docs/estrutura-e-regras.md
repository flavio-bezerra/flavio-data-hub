# Site de casamento de Victória & Flávio

## Escopo aprovado
Página principal com abertura, história, local/horários, orientações, presentes simbólicos e presença. Identidade clássica do convite preservada. RSVP por família/grupo com confirmação individual. Desenvolvimento e validação local antes da publicação.

## Arquitetura
React 18, TypeScript, Vite 7, Tailwind 3, shadcn. A rota / reúne as seções em src/pages/SaveTheDate.tsx. Conteúdo factual centralizado em src/features/casamento/conteudo.ts. Componentes por domínio: casamento, presentes e presenca. Rota /convite/:codigo para a confirmação individual. Código de portfólio removido por autorização: projeto exclusivo do casamento.

## Identidade e layout
Direção Herbário: pranchas botânicas antigas de domínio público (copo-de-leite, orquídea e violeta) e seções como papelaria. Paleta azul névoa/ardósia, verde eucalipto/tinta, branco papel e marrom claro/linho. Italianno nos nomes e títulos, Cormorant Garamond em datas e valores, Newsreader no corpo. História aguarda texto/foto aprovados. Navegação móvel em fluxo e orientações sempre visíveis. Detalhes, arquivos e evidência visual em identidade-e-layout.md.

## Dados confirmados
Victória & Flávio; 10 de outubro de 2027, domingo, 13h30 (alterado de 14h em 10/11/2026), fuso America/Sao_Paulo; DellaTorres Eventos; Mairiporã/SP; recepção no mesmo local.

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

## Estado e decisões pendentes

A página é uma prévia pública, não um serviço de RSVP/pagamentos em produção. O desenho desejado de RSVP por grupo está aprovado, mas persistência, autenticação no servidor, administração e políticas ainda não foram implementadas. O protótipo aceita demonstracao com pessoas fictícias e guarda respostas somente na memória React.

| Tema | Confirmado/implementado | Pendente |
|---|---|---|
| Evento | Data, horário, local, cidade e recepção no mesmo local | Endereço completo e mapa |
| Identidade | Grafia Victória, monograma, direção botânica e refinamento implementado | Aceite visual final e fotos/texto pessoal |
| RSVP | Convite de demonstração e resposta individual | Dia/ano do prazo em fevereiro, revisão de respostas, crianças/acompanhantes, backend/administração e retenção |
| Presentes | Catálogo/valores de exemplo e cobrança desabilitada | Itens/valores finais, provedor, Pix/cartão, taxas, parcelas, cotas e reembolso |
| Operação | GitHub/Actions/FTP e rota alternativa Databricks validados em entregas anteriores | Conciliação por entrega, conferência do deploy atual e procedimento de rollback exercitado |

Publicação do frontend estático não transforma as demonstrações em funcionalidades reais. Somente o servidor pode autorizar convidados; o provedor e webhook autenticado/idempotente confirmam pagamento. Lista/códigos reais e segredos permanecem fora do bundle público e do Git.

## Próximas etapas
Aprovar layout, texto e fotos; definir dia/ano do prazo em fevereiro, traje, endereço, crianças e acompanhantes; escolher backend e administração; escolher provedor, taxas, meios de pagamento, cotas e reembolso; implementar persistência e webhook; validar publicação e rollback.

## Publicação
O usuário autorizou commit/push pelo notebook Databricks e publicação automática da prévia após push na main. O workflow mantém workflow_dispatch e exige TypeScript, lint e build aprovados antes do FTP. A aprovação visual e os testes locais antecedem cada push destinado à publicação. Consulte agents/publicacao.md e docs/entrega-databricks.md. Upload, aplicação na pasta Git, push, resultado do Action e revisão visual são etapas distintas. A checagem pós-FTP confere entrega HTTP/MIME/hashes de HTML/JS/CSS, sem rollback automático. Git direto em outra máquina é permitido quando autorizado e disponível; a rota Databricks atende o ambiente restrito. Consulte desenvolvimento-hibrido.md para troca de máquina, contribuições simultâneas e limitações.
