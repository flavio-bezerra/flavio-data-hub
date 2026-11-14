/**
 * Consulta de status de cobrança Asaas
 */

function obterAmbiente() {
  const token = process.env.ASAAS_PAYMENT_TOKEN || process.env.ASSAS_PAYMENT_TOKEN;
  const isProd = process.env.NODE_ENV === 'production' && process.env.ASAAS_ENVIRONMENT !== 'sandbox';
  const baseUrl = isProd ? 'https://api.asaas.com/api/v3' : 'https://sandbox.asaas.com/api/v3';
  return { token, isProd, baseUrl };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, message: 'Método não permitido' });
  }

  const { token, baseUrl } = obterAmbiente();
  if (!token) {
    return res.status(503).json({ ok: false, message: 'Configuração indisponível' });
  }

  const { id } = req.query || {};
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ ok: false, message: 'Identificador de cobrança obrigatório' });
  }

  try {
    const response = await fetch(`${baseUrl}/payments/${encodeURIComponent(id)}`, {
      headers: {
        access_token: token,
        'User-Agent': 'Casamento-Victoria-Flavio/1.0'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        message: 'Cobrança não encontrada ou inválida no gateway'
      });
    }

    const data = await response.json();

    const pago = ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(data.status);

    return res.status(200).json({
      ok: true,
      id: data.id,
      status: data.status,
      pago,
      valor: data.value,
      dataPagamento: data.paymentDate || null
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      message: 'Falha ao consultar status da cobrança'
    });
  }
}
