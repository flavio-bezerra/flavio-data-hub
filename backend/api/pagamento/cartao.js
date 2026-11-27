/**
 * Processamento de Cartão de Crédito via Asaas
 */

const CATALOGO_PADRAO = [
  {
    "id": "filtro",
    "titulo": "Filtro de óleo para o Escort",
    "valor": 50
  },
  {
    "id": "jantar",
    "titulo": "Um jantar a dois",
    "valor": 150
  },
  {
    "id": "viagem",
    "titulo": "Um pedacinho da lua de mel",
    "valor": 500
  },
  {
    "id": "gasolina",
    "titulo": "Gasolina para o Escort chegar ao altar",
    "valor": 80
  },
  {
    "id": "cafe",
    "titulo": "Café para o noivo funcionar",
    "valor": 100
  },
  {
    "id": "pizza",
    "titulo": "Pizza para a primeira discussão terminar bem",
    "valor": 120
  },
  {
    "id": "kit",
    "titulo": "Kit de sobrevivência do marido",
    "valor": 180
  },
  {
    "id": "passeio",
    "titulo": "Um passeio inesquecível",
    "valor": 300
  },
  {
    "id": "pilates-pos-ressaca",
    "titulo": "Pilates pós-ressaca",
    "valor": 350
  },
  {
    "id": "terapia",
    "titulo": "Terapia para quem escolher a decoração",
    "valor": 200
  },
  {
    "id": "paz",
    "titulo": "Uma diária de paz: ninguém pergunta dos filhos",
    "valor": 250
  },
  {
    "id": "voo",
    "titulo": "Upgrade do voo",
    "valor": 700
  },
  {
    "id": "brinde",
    "titulo": "Um jantar de lua de mel sem converter o câmbio",
    "valor": 400
  },
  {
    "id": "aventura",
    "titulo": "Patrocínio oficial da próxima aventura",
    "valor": 1000
  },
  {
    "id": "cota-livre",
    "titulo": "Cota de carinho livre",
    "valor": 0,
    "livre": true
  }
];

function obterAmbiente() {
  const token = process.env.ASAAS_PAYMENT_TOKEN || process.env.ASSAS_PAYMENT_TOKEN;
  const isProd = process.env.NODE_ENV === 'production' && process.env.ASAAS_ENVIRONMENT !== 'sandbox';
  const baseUrl = isProd ? 'https://api.asaas.com/api/v3' : 'https://sandbox.asaas.com/api/v3';
  return { token, isProd, baseUrl };
}

function limparDigitos(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/\D/g, '');
}

function calcularOpcoes(item, valor, taxas, agora = Date.now()) {
  const fixo = taxas?.operationValue;
  const vencimento = taxas?.discountExpiration;
  const data = typeof vencimento === 'string' ? vencimento.replace(' ', 'T') : '';
  const expira = Date.parse(/T.*(?:Z|[+-]\d\d:?\d\d)$/i.test(data) ? data : `${data.length === 10 ? `${data}T00:00:00` : data}-03:00`);
  if (typeof fixo !== 'number' || !Number.isFinite(fixo) || fixo < 0 || (vencimento && !Number.isFinite(expira))) throw new Error('Taxas inválidas');
  const centavos = Math.round((item.livre ? valor : item.valor) * 100);
  const fixaCentavos = Math.round(fixo * 100);
  const minimo = Object.entries({ 1: 10, 2: 60, 3: 90, 6: 150 });
  return minimo.filter(([, base]) => centavos >= base * 100).map(([chave]) => {
    const parcelas = Number(chave);
    const normal = parcelas === 1 ? taxas.oneInstallmentPercentage : taxas.upToSixInstallmentsPercentage;
    const desconto = parcelas === 1 ? taxas.discountOneInstallmentPercentage : taxas.discountUpToSixInstallmentsPercentage;
    const percentual = expira > agora && desconto != null ? desconto : normal;
    if (typeof percentual !== 'number' || !Number.isFinite(percentual) || percentual < 0 || percentual >= 100) throw new Error('Percentual inválido');
    // R$ líquidos = total - tarifa fixa - percentual aplicado ao total.
    const totalCentavos = Math.ceil((centavos + fixaCentavos) / (1 - percentual / 100) - 1e-8);
    if (!Number.isSafeInteger(totalCentavos) || totalCentavos < centavos) throw new Error('Total inválido');
    return { parcelas, valorBaseCentavos: centavos, acrescimoCentavos: totalCentavos - centavos, totalCentavos };
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Método não permitido' });
  }

  const { token, baseUrl, isProd } = obterAmbiente();

  if (!token) {
    return res.status(503).json({
      ok: false,
      message: 'Configuração de pagamento indisponível no servidor'
    });
  }

  const {
    presenteId,
    nome,
    email,
    cpf,
    telefone,
    cep,
    numeroEndereco,
    valor,
    parcelas = 1,
    cartao,
    acao,
    totalAceitoCentavos
  } = req.body || {};

  const cotacao = acao === 'cotacao';
  const item = CATALOGO_PADRAO.find((p) => p.id === presenteId);
  if (!item) return res.status(400).json({ ok: false, message: 'Presente inválido. Escolha um item da lista.' });
  const valorNum = Number(valor);
  if (item.livre && (!Number.isFinite(valorNum) || valorNum < 10 || !Number.isSafeInteger(Math.round(valorNum * 100)))) {
    return res.status(400).json({ ok: false, message: 'Informe um valor válido a partir de R$ 10,00.' });
  }
  const numParcelas = Number(parcelas);
  if (!cotacao && (![1, 2, 3, 6].includes(numParcelas) || !Number.isSafeInteger(totalAceitoCentavos))) {
    return res.status(400).json({ ok: false, message: 'Confira o total e o parcelamento antes de pagar.' });
  }

  const headers = { access_token: token, 'Content-Type': 'application/json', 'User-Agent': 'Casamento-Victoria-Flavio/1.0' };
  let opcoes;
  try {
    const taxasResp = await fetch(`${baseUrl}/myAccount/fees/`, { headers, signal: AbortSignal.timeout(8000) });
    if (!taxasResp.ok) throw new Error(`Taxas indisponíveis (HTTP ${taxasResp.status})`);
    const taxas = await taxasResp.json().catch(() => null);
    opcoes = calcularOpcoes(item, valorNum, taxas?.payment?.creditCard);
  } catch (erro) {
    return res.status(503).json({ ok: false, message: 'Não foi possível calcular a tarifa do cartão. Tente novamente ou escolha outra forma de pagamento.', diagnostico: { ambiente: isProd ? 'producao' : 'sandbox', motivo: erro instanceof Error ? erro.message : 'erro desconhecido' } });
  }
  if (cotacao) return res.status(200).json({ ok: true, opcoes });
  const opcao = opcoes.find((p) => p.parcelas === numParcelas);
  if (!opcao || opcao.totalCentavos !== totalAceitoCentavos) {
    return res.status(409).json({ ok: false, message: 'O total ou o parcelamento mudou. Revise o novo valor antes de pagar.' });
  }
  const valorFinal = opcao.totalCentavos / 100;

  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ ok: false, message: 'Por favor, informe seu nome completo.' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ ok: false, message: 'Por favor, informe um e-mail válido.' });
  }

  const cpfLimpo = limparDigitos(cpf);
  if (cpfLimpo.length !== 11) {
    return res.status(400).json({ ok: false, message: 'Por favor, informe um CPF válido (11 dígitos).' });
  }

  if (!cartao || typeof cartao !== 'object') {
    return res.status(400).json({ ok: false, message: 'Dados do cartão de crédito não fornecidos.' });
  }

  const numeroCartao = limparDigitos(cartao.numero);
  if (numeroCartao.length < 13 || numeroCartao.length > 19) {
    return res.status(400).json({ ok: false, message: 'Número de cartão de crédito inválido.' });
  }

  if (!cartao.nomeTitular || typeof cartao.nomeTitular !== 'string' || cartao.nomeTitular.trim().length < 3) {
    return res.status(400).json({ ok: false, message: 'Informe o nome do titular como impresso no cartão.' });
  }

  const mesExp = limparDigitos(cartao.mesExpiracao);
  let anoExp = limparDigitos(cartao.anoExpiracao);
  if (anoExp.length === 2) anoExp = `20${anoExp}`;

  if (!mesExp || Number(mesExp) < 1 || Number(mesExp) > 12 || anoExp.length !== 4) {
    return res.status(400).json({ ok: false, message: 'Data de validade do cartão inválida.' });
  }

  const ccv = limparDigitos(cartao.ccv);
  if (ccv.length < 3 || ccv.length > 4) {
    return res.status(400).json({ ok: false, message: 'Código de segurança (CVV) inválido.' });
  }

  try {
    // 1. Localizar ou criar cliente no Asaas
    let customerId = null;
    const searchResp = await fetch(
      `${baseUrl}/customers?cpfCnpj=${encodeURIComponent(cpfLimpo)}`,
      { headers, signal: AbortSignal.timeout(10000) }
    );

    if (searchResp.ok) {
      const searchData = await searchResp.json();
      if (Array.isArray(searchData.data) && searchData.data.length > 0) {
        customerId = searchData.data[0].id;
      }
    }

    if (!customerId) {
      const createCustResp = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: nome.trim(),
          email: email.trim().toLowerCase(),
          cpfCnpj: cpfLimpo,
          notificationDisabled: true
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (!createCustResp.ok) {
        const errCust = await createCustResp.json().catch(() => ({}));
        const erroMsg = errCust.errors?.[0]?.description || 'Erro ao registrar cliente no gateway.';
        return res.status(400).json({ ok: false, message: erroMsg });
      }

      const custData = await createCustResp.json();
      customerId = custData.id;
    }

    // 2. Data de vencimento hoje
    const dueDate = new Date().toISOString().split('T')[0];


    const paymentPayload = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      dueDate,
      description: `Presente: ${item.titulo} — Victória & Flávio`,
      externalReference: `presente:${item.id}:${Date.now()}`.slice(0, 100),
      creditCard: {
        holderName: cartao.nomeTitular.trim().toUpperCase(),
        number: numeroCartao,
        expiryMonth: mesExp.padStart(2, '0'),
        expiryYear: anoExp,
        ccv
      },
      creditCardHolderInfo: {
        name: nome.trim(),
        email: email.trim().toLowerCase(),
        cpfCnpj: cpfLimpo,
        postalCode: limparDigitos(cep) || '01310100',
        addressNumber: (numeroEndereco || 'SN').toString().trim(),
        phone: limparDigitos(telefone) || '11999999999'
      }
    };

    if (numParcelas > 1) {
      paymentPayload.installmentCount = numParcelas;
      paymentPayload.totalValue = valorFinal;
    } else {
      paymentPayload.value = valorFinal;
    }

    const payResp = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentPayload),
      signal: AbortSignal.timeout(15000)
    });

    const payData = await payResp.json().catch(() => ({}));

    if (!payResp.ok) {
      const erroMsg = payData.errors?.[0]?.description || 'Transação não autorizada pela operadora do cartão.';
      return res.status(400).json({ ok: false, message: erroMsg });
    }

    const pago = ['CONFIRMED', 'RECEIVED'].includes(payData.status);

    return res.status(200).json({
      ok: true,
      cobrancaId: payData.id,
      status: payData.status,
      pago,
      valor: valorFinal,
      parcelas: numParcelas,
      presente: item.titulo,
      dataConfirmacao: payData.confirmedDate || null,
      ambiente: isProd ? 'producao' : 'sandbox'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Falha na comunicação com a operadora de cartão.'
    });
  }
}
