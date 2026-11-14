/**
 * Webhook de Pagamentos Asaas
 * Notificações assíncronas de pagamento confirmado
 */

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Método não permitido' });
  }

  const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;
  const receivedToken = req.headers['asaas-access-token'];

  // Se o token de webhook estiver configurado, valida
  if (webhookToken && receivedToken !== webhookToken) {
    return res.status(401).json({ ok: false, message: 'Não autorizado' });
  }

  const { event, payment } = req.body || {};

  if (!event || !payment) {
    return res.status(400).json({ ok: false, message: 'Payload inválido' });
  }

  // Eventos de interesse: PAYMENT_RECEIVED, PAYMENT_CONFIRMED
  if (['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'].includes(event)) {
    try {
      let ref = {};
      if (payment.externalReference) {
        try {
          ref = JSON.parse(payment.externalReference);
        } catch {}
      }

      // Log seguro (sem credenciais)
      console.log(`[PAGAMENTO CONFIRMADO] ID: ${payment.id} | Valor: R$ ${payment.value} | Convidado: ${ref.nomeConvidado || 'N/A'}`);

      // Aqui pode ser disparado o e-mail de agradecimento e gravação no banco
      return res.status(200).json({
        ok: true,
        recebido: true,
        id: payment.id,
        status: payment.status
      });
    } catch (err) {
      return res.status(500).json({ ok: false, message: 'Erro ao processar confirmação' });
    }
  }

  // Outros eventos recebidos
  return res.status(200).json({ ok: true, recebido: true });
}
