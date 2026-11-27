// Valores da conta: https://docs.asaas.com/reference/retrieve-account-fees
const valido = (valor) => typeof valor === 'number' && Number.isFinite(valor) && valor >= 0;
const centavos = (valor) => {
  if (!valido(valor) || !Number.isSafeInteger(Math.round(valor * 100))) throw new Error('Tarifa inválida');
  return Math.round(valor * 100);
};

function promocional(normal, desconto, vencimento, agora) {
  if (desconto == null) return normal;
  if (typeof vencimento !== 'string') throw new Error('Vencimento promocional indisponível');
  const data = vencimento.replace(' ', 'T');
  const fim = Date.parse(/T.*(?:Z|[+-]\d\d:?\d\d)$/i.test(data) ? data : `${data.length === 10 ? `${data}T00:00:00` : data}-03:00`);
  if (!Number.isFinite(fim)) throw new Error('Vencimento promocional inválido');
  return fim > agora ? desconto : normal;
}

export function calcularTotal(metodo, base, taxas, agora = Date.now()) {
  if (!Number.isSafeInteger(base) || base < 1000 || !taxas) throw new Error('Dados da tarifa indisponíveis');
  let total;
  if (metodo === 'boleto') {
    total = base + centavos(promocional(taxas.defaultValue, taxas.discountValue, taxas.expirationDate, agora));
  } else if (metodo === 'pix') {
    const { monthlyCreditsWithoutFee: franquia, creditsReceivedOfCurrentMonth: usados, percentageFee: percentual } = taxas;
    if (franquia != null && (!Number.isSafeInteger(franquia) || franquia < 0)) throw new Error('Franquia Pix inválida');
    if (franquia > 0 && (!Number.isSafeInteger(usados) || usados < 0)) throw new Error('Uso da franquia indisponível');
    if (franquia > 0 && usados < franquia) return base;
    const fixa = promocional(taxas.fixedFeeValue, taxas.fixedFeeValueWithDiscount, taxas.discountExpiration, agora);
    if (percentual == null || percentual === 0) {
      total = base + centavos(fixa ?? (percentual === 0 ? 0 : NaN));
    } else {
      if (!valido(percentual) || percentual >= 100 || (fixa != null && fixa !== 0)) throw new Error('Regra Pix não suportada');
      const minimo = centavos(taxas.minimumFeeValue ?? 0);
      const maximo = taxas.maximumFeeValue == null ? Infinity : centavos(taxas.maximumFeeValue);
      if (maximo < minimo) throw new Error('Limites Pix inválidos');
      const bruto = Math.ceil(base / (1 - percentual / 100) - 1e-8);
      total = base + Math.min(maximo, Math.max(minimo, bruto - base));
    }
  } else {
    throw new Error('Método inválido');
  }
  if (!Number.isSafeInteger(total)) throw new Error('Total inválido');
  return total;
}

export async function cotarCobranca(metodo, base, baseUrl, headers) {
  const resposta = await fetch(`${baseUrl}/myAccount/fees/`, { headers, signal: AbortSignal.timeout(8000) });
  if (!resposta.ok) throw new Error(`Tarifas indisponíveis (HTTP ${resposta.status})`);
  const dados = await resposta.json().catch(() => null);
  const taxas = dados?.payment?.[metodo === 'pix' ? 'pix' : 'bankSlip'];
  if (!taxas) throw new Error('Taxa ausente na resposta do Asaas');
  const total = calcularTotal(metodo, base, taxas);
  return { parcelas: 1, valorBaseCentavos: base, acrescimoCentavos: total - base, totalCentavos: total };
}
