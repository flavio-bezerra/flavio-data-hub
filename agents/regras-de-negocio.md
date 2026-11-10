# Regras de presença e presentes

Leia docs/estrutura-e-regras.md para requisitos, estado implementado e decisões pendentes. Identifique sempre se uma regra descreve o protótipo atual ou requisito da futura operação real.

## Presença
Cada convite representa uma família/grupo. A resposta pertence a cada pessoa: pendente, vai ou não vai. Em produção, a API resolve um token aleatório de alta entropia e retorna somente as pessoas daquele convite. Valide pertencimento de cada pessoa no servidor e aplique limitação de tentativas. Acrescentar acompanhantes e regras de crianças dependem de aprovação.

A meta de prazo é fevereiro; dia e ano aguardam confirmação. Até definição explícita, o frontend não deve anunciar uma data-limite. Em produção permita revisão da resposta dentro da regra aprovada e trate concorrência/idempotência. Política de retenção, administração e exportação ainda precisam de definição.

## Presentes
São presentes simbólicos, não entrega física. O casal aprova nomes e valores. O provedor cria checkout no servidor; preço vem do catálogo do servidor. Confirme pagamento por webhook validado e idempotente. Tela de retorno do checkout não comprova pagamento. Taxas, Pix/cartão, parcelas, reembolso, cotas e dados do recebedor dependem de decisão.

## Protótipo
Use exclusivamente família e presentes fictícios. Estado de presença permanece na memória da sessão React e se perde ao recarregar. A cobrança está desabilitada. Trate sucesso como demonstração, não reserva de presente ou confirmação real. Publicar o frontend não habilita persistência, autorização no servidor ou cobrança; esses recursos exigem projeto, aprovação e testes próprios.
