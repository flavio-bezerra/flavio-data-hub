import { timingSafeEqual } from 'node:crypto';

function tokensMatch(expected, received) {
  const a = Buffer.from(expected);
  const b = Buffer.from(received);

  return a.length === b.length && timingSafeEqual(a, b);
}

function isAllowedSelect(sql) {
  const normalized = sql
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  return normalized.startsWith('select ')
    && !normalized.includes(';')
    && !normalized.includes('into outfile')
    && !normalized.includes('into dumpfile')
    && !normalized.includes('load_file');
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

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      ok: false,
      message: 'Método não permitido'
    });
  }

  const sql = req.body?.sql;

  if (typeof sql !== 'string' || sql.trim().length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'Informe a consulta SQL'
    });
  }

  if (!isAllowedSelect(sql)) {
    return res.status(400).json({
      ok: false,
      message: 'Apenas SELECT simples é permitido'
    });
  }

  try {
    const response = await fetch(
      'https://casamento-flavio-victoria.com.br/api/execute-sql.php',
      {
        method: 'POST',
        headers: {
          'X-Bridge-Token': token,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ sql }),
        redirect: 'error',
        signal: AbortSignal.timeout(15000)
      }
    );

    const data = await response.json();

    return res.status(response.ok ? 200 : 502).json(data);
  } catch {
    return res.status(502).json({
      ok: false,
      message: 'Falha na comunicação com a HostGator'
    });
  }
}