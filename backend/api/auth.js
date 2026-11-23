import { chamarOperacao, FalhaDaApi } from '../banco/ponte-hostgator.js';
import { exigirGateway, lerSessao, escreverCookie, novoToken, limitarUso, responderFalha } from '../autenticacao/sessao.js';
import { verificarGoogle } from '../autenticacao/google.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    exigirGateway(req);
    const pilotEmail = process.env.ACCESS_GOOGLE_PILOT_EMAIL?.trim().toLowerCase();
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!pilotEmail || !googleClientId) throw new FalhaDaApi(503, 'Login de teste ainda não configurado.');
    if (req.method === 'POST' && !['google', 'logout'].includes(req.body.action)) {
      throw new FalhaDaApi(403, 'Nesta etapa, use somente o login de teste com Google.');
    }

    await limitarUso(req, 'auth');
    const session = await lerSessao(req, { anonymous: true });
    if (req.method === 'GET') {
      escreverCookie(res, session.token);
      return res.status(200).json({ ok: true, account: session.account, csrf: session.csrf, google_nonce: session.nonce, google_client_id: googleClientId });
    }
    if (req.body.action === 'logout') {
      await chamarOperacao('session.revoke', session.token);
      escreverCookie(res, '');
      return res.status(200).json({ ok: true });
    }

    const claims = await verificarGoogle(req.body.credential, session.nonce);
    const email = typeof claims.email === 'string' ? claims.email.trim().toLowerCase() : '';
    if (email !== pilotEmail || (!email.endsWith('@gmail.com') && !claims.hostedDomain)) {
      throw new FalhaDaApi(403, 'Conta não autorizada para a homologação.');
    }
    const { account } = await chamarOperacao('account.google', session.token, { subject: claims.subject, email, name: claims.name.slice(0, 160) });
    const token = novoToken();
    await chamarOperacao('session.rotate', session.token, { token, csrf: novoToken(), nonce: novoToken(), account_id: Number(account.id), session_version: Number(account.session_version) });
    escreverCookie(res, token);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return responderFalha(res, error);
  }
}
