/**
 * Emissão de Boleto Bancário via Asaas
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

function limparCpf(cpf) {
  if (typeof cpf !== 'string') return '';
  return cpf.replace(/\D/g, '');
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

  const { presenteId, nome, email, cpf, valor } = req.body || {};

  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ ok: false, message: 'Por favor, informe seu nome completo.' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ ok: false, message: 'Por favor, informe um e-mail válido.' });
  }

  const cpfLimpo = limparCpf(cpf);
  if (cpfLimpo.length !== 11) {
    return res.status(400).json({ ok: false, message: 'Por favor, informe um CPF válido (11 dígitos).' });
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

    // 2. Data de vencimento do boleto (3 dias à frente)
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 3);
    const dueDate = vencimento.toISOString().split('T')[0];

    const paymentPayload = {
      customer: customerId,
      billingType: 'BOLETO',
      value: valorFinal,
      dueDate,
      description: `Presente: ${item.titulo} — Victória & Flávio`,
      externalReference: `presente:${item.id}:${Date.now()}`.slice(0, 100)
    };

    const payResp = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentPayload),
      signal: AbortSignal.timeout(12000)
    });

    if (!payResp.ok) {
      const errPay = await payResp.json().catch(() => ({}));
      const erroMsg = errPay.errors?.[0]?.description || 'Erro ao emitir boleto bancário.';
      return res.status(400).json({ ok: false, message: erroMsg });
    }

    const payData = await payResp.json();
    const paymentId = payData.id;

    // 3. Obter linha digitável do boleto
    let linhaDigitavel = null;
    let codigoBarras = null;

    const lineResp = await fetch(`${baseUrl}/payments/${paymentId}/identificationField`, {
      headers,
      signal: AbortSignal.timeout(10000)
    });

    if (lineResp.ok) {
      const lineData = await lineResp.json();
      linhaDigitavel = lineData.identificationField;
      codigoBarras = lineData.barCode;
    }

    return res.status(200).json({
      ok: true,
      cobrancaId: paymentId,
      valor: valorFinal,
      presente: item.titulo,
      linhaDigitavel,
      codigoBarras,
      bankSlipUrl: payData.bankSlipUrl,
      invoiceUrl: payData.invoiceUrl,
      vencimento: dueDate,
      ambiente: isProd ? 'producao' : 'sandbox'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Falha na comunicação com o gateway de pagamento.'
    });
  }
}
