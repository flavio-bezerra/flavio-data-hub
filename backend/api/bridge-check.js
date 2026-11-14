import { timingSafeEqual } from 'node:crypto';

function tokensMatch(expected, received) {
  const a = Buffer.from(expected);
  const b = Buffer.from(received);

  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const token = process.env.HOSTGATOR_BRIDGE_TOKEN;

  if (!token) {
    return res.status(503).json({
      ok: false,
      message: 'Configuração da ponte indisponível'
    });
  }

  const received = req.headers['x-bridge-token'];

  if (
    typeof received !== 'string' ||
    !tokensMatch(token, received)
  ) {
    return res.status(401).json({
      ok: false,
      message: 'Não autorizado'
    });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      ok: false,
      message: 'Método não permitido'
    });
  }

  try {
    const response = await fetch(
      'https://casamento-flavio-victoria.com.br/api/bridge-check.php',
      {
        headers: {
          'X-Bridge-Token': token,
          Accept: 'application/json'
        },
        redirect: 'error',
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        message: 'A HostGator não confirmou o teste',
        upstreamStatus: response.status
      });
    }

    const data = await response.json();

    if (data.ok !== true) {
      throw new Error('Resposta inesperada');
    }

    return res.status(200).json({
      ok: true,
      message: 'Vercel → HostGator → MySQL validado'
    });
  } catch {
    return res.status(502).json({
      ok: false,
      message: 'Falha na comunicação com a HostGator'
    });
  }
}