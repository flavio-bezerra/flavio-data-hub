/**
 * Criação de cobrança Cartão de Crédito via Asaas
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
  const baseUrl = isProd ? 'https://api.asaas.com/api/v3' : 'https://sandbox.asaas.com/api/v3';
  return { token, isProd, baseUrl };
}

function limparCpf(cpf) {
  if (typeof cpf !== 'string') return '';
  return cpf.replace(/\D/g, '');
}

function limparCartao(numero) {
  if (typeof numero !== 'string') return '';
  return numero.replace(/\D/g, '');
}

function validarCartao(numero) {
  const limpo = limparCartao(numero);
  if (limpo.length < 13 || limpo.length > 19) return false;
  // Luhn algorithm
  let soma = 0;
  let alternar = false;
  for (let i = limpo.length - 1; i >= 0; i--) {
    let digito = parseInt(limpo[i], 10);
    if (alternar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    soma += digito;
    alternar = !alternar;
  }
  return soma % 10 === 0;
}

import { cotarCobranca, calcularTotal } from '../../lib/tarifas-asaas.js';

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

  const { presenteId, nome, email, cpf, mensagem, valor, acao, totalAceitoCentavos, parcelas, cartao } = req.body || {};
  const item = CATALOGO_PADRAO.find((p) => p.id === presenteId);
  if (!item) return res.status(400).json({ ok: false, message: 'Presente inválido.' });
  const base = Math.round((item.livre ? Number(valor) : item.valor) * 100);
  if (!Number.isSafeInteger(base) || base < 1000) return res.status(400).json({ ok: false, message: 'Informe um valor válido a partir de R$ 10,00.' });

  const parcelasReq = Number.isInteger(parcelas) ? parcelas : 1;
  if (parcelasReq < 1 || parcelasReq > 21) return res.status(400).json({ ok: false, message: 'Parcelas inválidas (1 a 21).' });

  const headers = { access_token: token, 'Content-Type': 'application/json', 'User-Agent': 'Casamento-Victoria-Flavio/1.0' };
  let cotacao;
  try {
    cotacao = await cotarCobranca('cartao', base, baseUrl, headers, parcelasReq);
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : 'erro desconhecido';
    // Validation errors (parcelamento mínimo/máximo) should return 400
    if (msg.includes('parcelamento') || msg.includes('mínimo') || msg.includes('máximo')) {
      return res.status(400).json({ ok: false, message: msg });
    }
    return res.status(503).json({ ok: false, message: 'Não foi possível calcular a tarifa do cartão.', diagnostico: { ambiente: isProd ? 'producao' : 'sandbox', motivo: msg } });
  }
  if (acao === 'cotacao') return res.status(200).json({ ok: true, opcoes: cotacao.opcoes, valorBaseCentavos: cotacao.valorBaseCentavos });
  const opcao = cotacao.opcoes.find((o) => o.parcelas === parcelasReq) ?? cotacao.opcoes[0];
  if (totalAceitoCentavos !== opcao.totalCentavos) return res.status(409).json({ ok: false, message: 'Confira o total atualizado antes de gerar a cobrança.' });
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

  if (!cartao || typeof cartao !== 'object') {
    return res.status(400).json({ ok: false, message: 'Dados do cartão são obrigatórios.' });
  }

  const numeroCartao = limparCartao(cartao.numero);
  if (!validarCartao(numeroCartao)) {
    return res.status(400).json({ ok: false, message: 'Número do cartão inválido.' });
  }

  const validade = cartao.validade;
  if (!validade || !/^\d{2}\/\d{2}$/.test(validade)) {
    return res.status(400).json({ ok: false, message: 'Validade inválida (MM/AA).' });
  }
  const [mes, ano] = validade.split('/').map(Number);
  const agora = new Date();
  const anoAtual = agora.getFullYear() % 100;
  const mesAtual = agora.getMonth() + 1;
  if (mes < 1 || mes > 12 || ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
    return res.status(400).json({ ok: false, message: 'Cartão expirado.' });
  }

  const cvv = cartao.cvv;
  if (!cvv || !/^\d{3,4}$/.test(cvv)) {
    return res.status(400).json({ ok: false, message: 'CVV inválido.' });
  }

  const titular = cartao.titular;
  if (!titular || typeof titular !== 'string' || titular.trim().length < 2) {
    return res.status(400).json({ ok: false, message: 'Nome do titular obrigatório.' });
  }

  try {
    const headers = { access_token: token, 'Content-Type': 'application/json', 'User-Agent': 'Casamento-Victoria-Flavio/1.0' };

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

    // Tokenizar cartão
    const cardPayload = {
      customer: customerId,
      holderName: titular.trim(),
      number: numeroCartao,
      expiryMonth: mes.toString().padStart(2, '0'),
      expiryYear: ('20' + ano).toString(),
      ccv: cvv
    };

    let creditCardToken = null;
    const cardResp = await fetch(`${baseUrl}/creditCards`, {
      method: 'POST',
      headers,
      body: JSON.stringify(cardPayload),
      signal: AbortSignal.timeout(10000)
    });

    if (!cardResp.ok) {
      const errCard = await cardResp.json().catch(() => ({}));
      const erroMsg = errCard.errors?.[0]?.description || 'Erro ao tokenizar cartão.';
      return res.status(400).json({ ok: false, message: erroMsg });
    }

    const cardData = await cardResp.json();
    creditCardToken = cardData.creditCardToken;

    // Data de vencimento (2 dias à frente)
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 2);
    const dueDate = vencimento.toISOString().split('T')[0];

    const paymentPayload = {
      customer: customerId,
      billingType: 'CREDIT_CARD',
      value: opcao.totalCentavos / 100,
      dueDate,
      description: `Presente: ${item.titulo} — Victória & Flávio`,
      externalReference: `presente:${item.id}:${Date.now()}`.slice(0, 100),
      creditCardToken,
      installmentCount: parcelasReq
    };

    const payResp = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentPayload),
      signal: AbortSignal.timeout(12000)
    });

    if (!payResp.ok) {
      const errPay = await payResp.json().catch(() => ({}));
      const erroMsg = errPay.errors?.[0]?.description || 'Erro ao gerar cobrança no cartão.';
      return res.status(400).json({ ok: false, message: erroMsg });
    }

    const payData = await payResp.json();
    const paymentId = payData.id;

    return res.status(200).json({
      ok: true,
      cobrancaId: paymentId,
      valor: opcao.totalCentavos / 100,
      presente: item.titulo,
      parcelas: parcelasReq,
      invoiceUrl: payData.invoiceUrl,
      ambiente: isProd ? 'producao' : 'sandbox'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Falha na comunicação com o gateway de pagamento.'
    });
  }
}