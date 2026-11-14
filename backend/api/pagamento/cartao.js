/**
 * Processamento de Cartão de Crédito via Asaas
 */

const CATALOGO_PADRAO = [
  { id: 'jantar', titulo: 'Um jantar a dois', valor: 150 },
  { id: 'passeio', titulo: 'Um passeio inesquecível', valor: 300 },
  { id: 'viagem', titulo: 'Um pedacinho da lua de mel', valor: 500 },
  { id: 'cota-livre', titulo: 'Cota de carinho livre', valor: 0, livre: true }
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
    cartao
  } = req.body || {};

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

  const item = CATALOGO_PADRAO.find((p) => p.id === presenteId) || CATALOGO_PADRAO[0];
  let valorFinal = item.valor;

  if (item.livre) {
    const valorNum = Number(valor);
    if (!valorNum || valorNum < 10) {
      return res.status(400).json({ ok: false, message: 'O valor mínimo para contribuição é de R$ 10,00.' });
    }
    valorFinal = Math.round(valorNum * 100) / 100;
  }

  try {
    const headers = {
      access_token: token,
      'Content-Type': 'application/json',
      'User-Agent': 'Casamento-Victoria-Flavio/1.0'
    };

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

    const numParcelas = Math.min(Math.max(Number(parcelas) || 1, 1), 12);

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
