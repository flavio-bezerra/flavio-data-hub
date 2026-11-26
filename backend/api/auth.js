import { chamarOperacao, FalhaDaApi } from '../banco/ponte-hostgator.js';
import { exigirGateway, lerSessao, escreverCookie, novoToken, limitarUso, responderFalha } from '../autenticacao/sessao.js';
import { verificarGoogle } from '../autenticacao/google.js';
import { enviarLink } from '../autenticacao/email.js';
import crypto from 'node:crypto';

// Gera hash scrypt no formato esperado pelo PHP: scrypt$salt$hash
function gerarHashScrypt(senha) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(senha, salt, 64, { maxmem: 64 * 1024 * 1024 });
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

// Verifica senha contra hash scrypt armazenado
function verificarScrypt(senha, hashArmazenado) {
  try {
    const partes = hashArmazenado.split('$');
    if (partes.length !== 3 || partes[0] !== 'scrypt') return false;
    const salt = Buffer.from(partes[1], 'hex');
    const hashEsperado = Buffer.from(partes[2], 'hex');
    const hash = crypto.scryptSync(senha, salt, 64, { maxmem: 64 * 1024 * 1024 });
    return crypto.timingSafeEqual(hash, hashEsperado);
  } catch { return false; }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    exigirGateway(req);
    const pilotEmail = process.env.ACCESS_GOOGLE_PILOT_EMAIL?.trim().toLowerCase();
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const inviteAccess = process.env.ACCESS_GOOGLE_INVITES_ENABLED === 'true' && !pilotEmail;
    if (!googleClientId || (!pilotEmail && !inviteAccess)) throw new FalhaDaApi(503, 'O acesso por Google está indisponível no momento.');

    const acoesSemGoogle = ['email_login', 'register', 'esqueci_senha', 'resetar_senha', 'verificar_email', 'logout'];
    if (req.method === 'POST' && !['google', 'logout', ...acoesSemGoogle].includes(req.body.action)) {
      throw new FalhaDaApi(403, 'Use sua conta Google para entrar.');
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
    if (req.body.action === 'google') {
      const claims = await verificarGoogle(req.body.credential, session.nonce);
      const email = typeof claims.email === 'string' ? claims.email.trim().toLowerCase() : '';
      if ((pilotEmail && email !== pilotEmail) || (!email.endsWith('@gmail.com') && !claims.hostedDomain)) {
        throw new FalhaDaApi(403, 'Esta conta Google não está autorizada a entrar.');
      }
      const { account } = await chamarOperacao(inviteAccess ? 'account.google_invite' : 'account.google', session.token, { subject: claims.subject, email, name: claims.name.slice(0, 160) });
      const token = novoToken();
      await chamarOperacao('session.rotate', session.token, { token, csrf: novoToken(), nonce: novoToken(), account_id: Number(account.id), session_version: Number(account.session_version) });
      escreverCookie(res, token);
      return res.status(200).json({ ok: true });
    }

    // ==================== EMAIL / SENHA ====================

    if (req.body.action === 'email_login') {
      const { email, senha } = req.body;
      if (!email || !senha) throw new FalhaDaApi(422, 'E-mail e senha são obrigatórios.');
      const { account } = await chamarOperacao('account.lookup', session.token, { email });
      if (!account || !account.password_hash) throw new FalhaDaApi(401, 'E-mail ou senha inválidos.');
      if (account.disabled_at) throw new FalhaDaApi(403, 'Conta indisponível.');
      if (!verificarScrypt(senha, account.password_hash)) throw new FalhaDaApi(401, 'E-mail ou senha inválidos.');
      const token = novoToken();
      await chamarOperacao('session.rotate', session.token, { token, csrf: novoToken(), nonce: novoToken(), account_id: Number(account.id), session_version: Number(account.session_version) });
      escreverCookie(res, token);
      return res.status(200).json({ ok: true });
    }

    if (req.body.action === 'register') {
      const { name, email, senha, idade } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 160) throw new FalhaDaApi(422, 'Nome inválido.');
      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new FalhaDaApi(422, 'E-mail inválido.');
      if (!senha || typeof senha !== 'string' || senha.length < 8) throw new FalhaDaApi(422, 'Senha deve ter pelo menos 8 caracteres.');

      // Verifica se email já está cadastrado
      const existe = await chamarOperacao('account.lookup', session.token, { email });
      if (existe.account) throw new FalhaDaApi(409, 'E-mail já cadastrado.');

      const password_hash = gerarHashScrypt(senha);
      const result = await chamarOperacao('account.register', session.token, { email, name: name.trim(), password_hash });
      const account = result.account;

      // Cria token de confirmação de email e envia
      const verifyToken = novoToken();
      await chamarOperacao('account.token', session.token, { account_id: Number(account.id), purpose: 'verify_email', token: verifyToken });
      await enviarLink(email, 'verify_email', verifyToken);

      return res.status(200).json({ ok: true, message: 'Conta criada. Verifique seu e-mail para confirmar o cadastro.' });
    }

    if (req.body.action === 'esqueci_senha') {
      const { email } = req.body;
      if (!email) throw new FalhaDaApi(422, 'E-mail é obrigatório.');
      const { account } = await chamarOperacao('account.lookup', session.token, { email });
      // Não revela se o email existe ou não (segurança)
      if (!account) return res.status(200).json({ ok: true, message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação.' });

      const resetToken = novoToken();
      await chamarOperacao('account.token', session.token, { account_id: Number(account.id), purpose: 'reset_password', token: resetToken });
      await enviarLink(email, 'reset_password', resetToken);
      return res.status(200).json({ ok: true, message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação.' });
    }

    if (req.body.action === 'resetar_senha') {
      const { token, senha } = req.body;
      if (!token || !senha || senha.length < 8) throw new FalhaDaApi(422, 'Token e senha são obrigatórios.');
      const password_hash = gerarHashScrypt(senha);
      await chamarOperacao('account.consume_token', session.token, { purpose: 'reset_password', token, password_hash });
      escreverCookie(res, '');
      return res.status(200).json({ ok: true, message: 'Senha redefinida com sucesso. Faça login novamente.' });
    }

    if (req.body.action === 'verificar_email') {
      const { token } = req.body;
      if (!token) throw new FalhaDaApi(422, 'Token é obrigatório.');
      await chamarOperacao('account.consume_token', session.token, { purpose: 'verify_email', token });
      return res.status(200).json({ ok: true, message: 'E-mail confirmado com sucesso.' });
    }

    throw new FalhaDaApi(400, 'Ação não reconhecida.');
  } catch (error) {
    return responderFalha(res, error);
  }
}
