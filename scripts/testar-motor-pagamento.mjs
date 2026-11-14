import fs from 'node:fs';
import path from 'node:path';
import pixHandler from '../backend/api/pagamento/pix.js';
import boletoHandler from '../backend/api/pagamento/boleto.js';
import cartaoHandler from '../backend/api/pagamento/cartao.js';
import statusHandler from '../backend/api/pagamento/status.js';

// Carregar .env.local
const envFile = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...rest] = trimmed.split('=');
      const v = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
      if (k.trim()) process.env[k.trim()] = v;
    }
  }
}

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(name, val) {
      this.headers[name] = val;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    }
  };
}

async function testarTodosOsMeios() {
  console.log('=== Teste Completo: Pix, Boleto e Cartão (Asaas Sandbox) ===\n');

  // 1. Teste de criação de Pix
  console.log('1. Testando POST /api/pagamento/pix...');
  const reqPix = {
    method: 'POST',
    body: {
      presenteId: 'jantar',
      nome: 'Flávio Menegueco (Teste Pix)',
      email: 'flaviomenegueco@gmail.com',
      cpf: '03167408375',
      mensagem: 'Muitas felicidades aos noivos Victória e Flávio!'
    }
  };
  const resPix = createMockRes();
  await pixHandler(reqPix, resPix);
  console.log(`Status HTTP Pix: ${resPix.statusCode}`);
  if (resPix.statusCode !== 200 || !resPix.data?.ok) {
    throw new Error('Falha no Pix');
  }
  console.log(`Pix Copia e Cola gerado: ${resPix.data.pixCopiaECola.slice(0, 45)}...`);
  console.log(`Cobrança Pix ID: ${resPix.data.cobrancaId}`);

  // 2. Teste de emissão de Boleto
  console.log('\n2. Testando POST /api/pagamento/boleto...');
  const reqBol = {
    method: 'POST',
    body: {
      presenteId: 'passeio',
      nome: 'Flávio Menegueco (Teste Boleto)',
      email: 'flaviomenegueco@gmail.com',
      cpf: '03167408375'
    }
  };
  const resBol = createMockRes();
  await boletoHandler(reqBol, resBol);
  console.log(`Status HTTP Boleto: ${resBol.statusCode}`);
  if (resBol.statusCode !== 200 || !resBol.data?.ok) {
    throw new Error('Falha no Boleto');
  }
  console.log(`Linha Digitável: ${resBol.data.linhaDigitavel}`);
  console.log(`PDF Boleto: ${resBol.data.bankSlipUrl}`);
  console.log(`Cobrança Boleto ID: ${resBol.data.cobrancaId}`);

  // 3. Teste de Cartão de Crédito
  console.log('\n3. Testando POST /api/pagamento/cartao...');
  const reqCard = {
    method: 'POST',
    body: {
      presenteId: 'viagem',
      nome: 'Flávio Menegueco (Teste Cartão)',
      email: 'flaviomenegueco@gmail.com',
      cpf: '03167408375',
      parcelas: 2,
      cartao: {
        nomeTitular: 'FLAVIO M BEZERRA',
        numero: '4024007153763191',
        mesExpiracao: '12',
        anoExpiracao: '2028',
        ccv: '123'
      }
    }
  };
  const resCard = createMockRes();
  await cartaoHandler(reqCard, resCard);
  console.log(`Status HTTP Cartão: ${resCard.statusCode}`);
  if (resCard.statusCode !== 200 || !resCard.data?.ok) {
    throw new Error('Falha no Cartão: ' + JSON.stringify(resCard.data));
  }
  console.log(`Status Cartão: ${resCard.data.status} (Pago: ${resCard.data.pago})`);
  console.log(`Cobrança Cartão ID: ${resCard.data.cobrancaId} (${resCard.data.parcelas}x de R$ ${resCard.data.valor / resCard.data.parcelas})`);

  console.log('\n[TODOS OS 3 MEIOS DE PAGAMENTO TESTADOS E HOMOLOGADOS COM SUCESSO!]');
}

testarTodosOsMeios().catch((err) => {
  console.error('\n[ERRO NO TESTE]:', err.message);
  process.exit(1);
});
