import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';

const site = new URL(process.argv[2] || 'https://casamento-flavio-victoria.com.br/');
const htmlLocal = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const assets = [...htmlLocal.matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css))"/g)].map(match => match[1]);
if (!assets.some(path => path.endsWith('.js')) || !assets.some(path => path.endsWith('.css'))) {
  throw new Error('Build sem referências JS/CSS esperadas');
}
let aprovado = false;
for (let tentativa = 1; tentativa <= 3; tentativa++) {
  try {
    const htmlResposta = await fetch(site, { signal: AbortSignal.timeout(20000), headers: { 'Cache-Control': 'no-cache' } });
    if (!htmlResposta.ok || !htmlResposta.headers.get('content-type')?.includes('text/html')) {
      throw new Error(`HTML: HTTP ${htmlResposta.status}, tipo ${htmlResposta.headers.get('content-type')}`);
    }
    const htmlPublicado = await htmlResposta.text();
    for (const path of assets) {
      if (!htmlPublicado.includes(path)) throw new Error(`HTML publicado não referencia o build atual: ${path}`);
      const url = new URL(path, site);
      const resposta = await fetch(url, { signal: AbortSignal.timeout(20000) });
      const tipo = resposta.headers.get('content-type') || '';
      if (!resposta.ok || (path.endsWith('.js') ? !/(javascript|ecmascript)/i.test(tipo) : !tipo.includes('text/css'))) {
        throw new Error(`${path}: HTTP ${resposta.status}, tipo ${tipo}`);
      }
      const remoto = Buffer.from(await resposta.arrayBuffer());
      const local = await readFile(new URL(`../dist${path}`, import.meta.url));
      const hashRemoto = createHash('sha256').update(remoto).digest('hex');
      const hashLocal = createHash('sha256').update(local).digest('hex');
      if (hashRemoto !== hashLocal) throw new Error(`Conteúdo diferente do build: ${path}`);
      console.log(`OK ${path}: ${remoto.length} bytes, SHA256 ${hashRemoto}`);
    }
    aprovado = true;
    console.log('HTML e assets publicados acessíveis e iguais ao build. Renderização no navegador deve ser validada separadamente.');
    break;
  } catch (erro) {
    console.error(`Tentativa ${tentativa}/3: ${erro.message}`);
    if (tentativa < 3) await delay(5000);
  }
}
if (!aprovado) process.exitCode = 1;
