/**
 * Criação de cobrança PIX via Asaas
 * Suporta Sandbox (desenvolvimento) e Produção (deploy)
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
  const baseUrl = isProd ? 'https://api.asaas.com/v3' : 'https://api-sandbox.asaas.com/v3';
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

  const { presenteId, nome, email, cpf, mensagem, valor, acao, totalAceitoCentavos } = req.body || {};
  const item = CATALOGO_PADRAO.find((p) => p.id === presenteId);
  if (!item) return res.status(400).json({ ok: false, message: 'Presente inválido.' });
  const base = Math.round((item.livre ? Number(valor) : item.valor) * 100);
  if (!Number.isSafeInteger(base) || base < 1000) return res.status(400).json({ ok: false, message: 'Informe um valor válido a partir de R$ 10,00.' });
  const headers = { access_token: token, 'Content-Type': 'application/json', 'User-Agent': 'Casamento-Victoria-Flavio/1.0' };
  let cotacao;
  try {
    cotacao = await cotarCobranca('pix', base, baseUrl, headers);
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : 'erro desconhecido';
    // Validation errors should return 400 (future-proofing)
    if (msg.includes('parcelamento') || msg.includes('mínimo') || msg.includes('máximo')) {
      return res.status(400).json({ ok: false, message: msg });
    }
    return res.status(503).json({ ok: false, message: 'Não foi possível calcular a tarifa Pix.' });
  }
  const opcao = cotacao.opcoes[0];
  if (acao === 'cotacao') return res.status(200).json({ ok: true, opcoes: cotacao.opcoes });
  if (totalAceitoCentavos !== opcao.totalCentavos) return res.status(409).json({ ok: false, message: 'Confira o total atualizado antes de gerar o Pix.' });
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
      return res.status(502).json({ ok: false, message: 'Não foi possível consultar o cliente no gateway de pagamento.' });
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
        return res.status(400).json({ ok: false, message: erroMsg });
      }

      const custData = await createCustResp.json();
      customerId = custData.id;
    }

    // 2. Data de vencimento (2 dias à frente)
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 2);
    const dueDate = vencimento.toISOString().split('T')[0];

    const paymentPayload = {
      customer: customerId,
      billingType: 'PIX',
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
      const erroMsg = errPay.errors?.[0]?.description || 'Erro ao gerar cobrança Pix.';
      return res.status(400).json({ ok: false, message: erroMsg });
    }

    const payData = await payResp.json();
    const paymentId = payData.id;

    // 3. Obter QR Code PIX e Payload Copia-e-Cola
    let pixPayload = null;
    let qrCodeBase64 = null;
    let expirationDate = null;

    const pixResp = await fetch(`${baseUrl}/payments/${paymentId}/pixQrCode`, {
      headers,
      signal: AbortSignal.timeout(10000)
    });

    if (!pixResp.ok) {
      return res.status(502).json({
        ok: false,
        message: 'A cobrança foi criada, mas não foi possível obter o QR Code Pix. Não tente pagar com outro código; entre em contato para confirmar a cobrança.',
        cobrancaId: paymentId
      });
    }

    const pixData = await pixResp.json().catch(() => null);
    pixPayload = typeof pixData?.payload === 'string' ? pixData.payload.trim() : '';
    qrCodeBase64 = typeof pixData?.encodedImage === 'string' ? pixData.encodedImage : null;
    expirationDate = pixData?.expirationDate ?? null;

    if (!pixPayload) {
      return res.status(502).json({
        ok: false,
        message: 'A cobrança foi criada, mas o Asaas não retornou um código Pix válido. Não tente novamente antes de confirmar a cobrança.',
        cobrancaId: paymentId
      });
    }

    return res.status(200).json({
      ok: true,
      cobrancaId: paymentId,
      valor: valorFinal,
      presente: item.titulo,
      pixCopiaECola: pixPayload,
      qrCodeBase64,
      expirationDate,
      ambiente: isProd ? 'producao' : 'sandbox'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Falha na comunicação com o gateway de pagamento.'
    });
  }
}
