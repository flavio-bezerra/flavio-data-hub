/**
 * Emissão de Boleto Bancário via Asaas
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

function limparCpf(cpf) {
  if (typeof cpf !== 'string') return '';
  return cpf.replace(/\D/g, '');
}

import { cotarCobranca } from '../../lib/tarifas-asaas.js';

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

  const { presenteId, nome, email, cpf, valor, acao, totalAceitoCentavos } = req.body || {};
  const item = CATALOGO_PADRAO.find((p) => p.id === presenteId);
  if (!item) return res.status(400).json({ ok: false, message: 'Presente inválido.' });
  const base = Math.round((item.livre ? Number(valor) : item.valor) * 100);
  if (!Number.isSafeInteger(base) || base < 1000) return res.status(400).json({ ok: false, message: 'Informe um valor válido a partir de R$ 10,00.' });
  const headers = { access_token: token, 'Content-Type': 'application/json', 'User-Agent': 'Casamento-Victoria-Flavio/1.0' };
  let cotacao;
  try {
    cotacao = await cotarCobranca('boleto', base, baseUrl, headers);
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : 'erro desconhecido';
    // Validation errors should return 400 (future-proofing)
    if (msg.includes('parcelamento') || msg.includes('mínimo') || msg.includes('máximo')) {
      return res.status(400).json({ ok: false, message: msg });
    }
    return res.status(503).json({ ok: false, message: 'Não foi possível calcular a tarifa do boleto.', diagnostico: { ambiente: isProd ? 'producao' : 'sandbox', motivo: msg } });
  }
  const opcao = cotacao.opcoes[0];
  if (acao === 'cotacao') return res.status(200).json({ ok: true, opcoes: cotacao.opcoes });
  if (totalAceitoCentavos !== opcao.totalCentavos) return res.status(409).json({ ok: false, message: 'Confira o total atualizado antes de emitir o boleto.' });
  const valorFinal = opcao.totalCentavos / 100;

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

  try {

    // 1. Localizar ou criar cliente no Asaas
    let customerId = null;
    const searchResp = await fetch(
      `${baseUrl}/customers?cpfCnpj=${encodeURIComponent(cpfLimpo)}`,
      { headers, signal: AbortSignal.timeout(10000) }
    );

    if (searchResp.ok) {
      const searchData = await searchResp.json().catch(() => ({}));
      if (Array.isArray(searchData.data) && searchData.data.length > 0) {
        customerId = searchData.data[0].id;
      }
    } else {
      const errText = await searchResp.text().catch(() => '');
      return res.status(400).json({ ok: false, message: 'Erro ao buscar cliente no gateway. Verifique a configuração da conta Asaas.', diagnostico: { status: searchResp.status, body: errText } });
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
        const errText = await createCustResp.text().catch(() => '');
        let errCust = {};
        try { errCust = JSON.parse(errText); } catch {}
        const erroMsg = errCust.errors?.[0]?.description || errCust.message || errText || 'Erro ao registrar cliente no gateway.';
        return res.status(400).json({ ok: false, message: erroMsg, diagnostico: { status: createCustResp.status, body: errText } });
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
