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

export function calcularTotal(metodo, base, taxas, agora = Date.now(), parcelas = 1) {
  if (!Number.isSafeInteger(base) || base < 1000) throw new Error('Valor base inválido');
  // Se taxas não vieram da API (null/undefined), usa valores padrão conservadores
  const t = taxas || {};
  let total;
  if (metodo === 'boleto') {
    total = base + centavos(promocional(t.defaultValue ?? 6.96, t.discountValue ?? null, t.expirationDate ?? null, agora));
  } else if (metodo === 'pix') {
    // Valores padrão conservadores quando a API não retorna as tarifas
    const franquia = t.monthlyCreditsWithoutFee ?? 30;
    const usados = t.creditsReceivedOfCurrentMonth ?? 0;
    if (!Number.isSafeInteger(franquia) || franquia < 0) throw new Error('Franquia Pix inválida');
    if (franquia > 0 && (!Number.isSafeInteger(t.creditsReceivedOfCurrentMonth ?? 0) || (t.creditsReceivedOfCurrentMonth ?? 0) < 0)) throw new Error('Uso da franquia indisponível');
    if (franquia > 0 && usados < franquia) return base;
    const fixa = promocional(t.fixedFeeValue ?? 0.99, t.fixedFeeValueWithDiscount ?? null, t.discountExpiration ?? null, agora);
    const percentual = t.percentageFee ?? 0.99;
    if (percentual == null || percentual === 0) {
      total = base + centavos(fixa ?? (percentual === 0 ? 0 : NaN));
    } else {
      if (!valido(percentual) || percentual >= 100 || (fixa != null && fixa !== 0)) throw new Error('Regra Pix não suportada');
      const minimo = centavos(t.minimumFeeValue ?? 0.29);
      const maximo = t.maximumFeeValue == null ? Infinity : centavos(t.maximumFeeValue);
      if (maximo < minimo) throw new Error('Limites Pix inválidos');
      const bruto = Math.ceil(base / (1 - percentual / 100) - 1e-8);
      total = base + Math.min(maximo, Math.max(minimo, bruto - base));
    }
  } else if (metodo === 'cartao') {
    // Taxas de cartão de crédito: operationValue + percentual por parcela
    const operacao = t.operationValue ?? 0.49;
    let percentual;
    if (parcelas <= 1) {
      percentual = t.oneInstallmentPercentage ?? 2.99;
    } else if (parcelas <= 6) {
      percentual = t.upToSixInstallmentsPercentage ?? 2.99;
    } else if (parcelas <= 12) {
      percentual = t.upToTwelveInstallmentsPercentage ?? 2.99;
    } else if (parcelas <= 21) {
      percentual = t.upToTwentyOneInstallmentsPercentage ?? 4.29;
    } else {
      throw new Error('Parcelamento inválido (máximo 21x)');
    }
    // Verifica se há promoção vigente
    const percentualPromo = promocional(
      percentual,
      parcelas <= 1 ? t.discountOneInstallmentPercentage ?? null :
        parcelas <= 6 ? t.discountUpToSixInstallmentsPercentage ?? null :
          parcelas <= 12 ? t.discountUpToTwelveInstallmentsPercentage ?? null :
            t.discountUpToTwentyOneInstallmentsPercentage ?? null,
      t.discountExpiration ?? null,
      agora
    );
    const percentualFinal = percentualPromo ?? percentual;
    if (!valido(percentualFinal) || percentualFinal >= 100) throw new Error('Percentual de cartão inválido');
    const taxaOperacao = centavos(operacao);
    const acrescimoPercentual = Math.ceil(base * percentualFinal / 100 - 1e-8);
    total = base + taxaOperacao + acrescimoPercentual;
  } else {
    throw new Error('Método inválido');
  }
  if (!Number.isSafeInteger(total)) throw new Error('Total inválido');
  return total;
}

export async function cotarCobranca(metodo, base, baseUrl, headers, parcelas = 1) {
  try {
    const resposta = await fetch(`${baseUrl}/myAccount/fees/`, { headers, signal: AbortSignal.timeout(8000) });
    if (resposta.status === 404) {
      // Endpoint não existe na conta Asaas (ex: sandbox ou conta sem tarifas configuradas)
      return calcularTotal(metodo, base, null, Date.now(), parcelas);
    }
    if (!resposta.ok) throw new Error(`Tarifas indisponíveis (HTTP ${resposta.status})`);
    const dados = await resposta.json().catch(() => null);
    const taxas = dados?.payment?.[metodo === 'pix' ? 'pix' : metodo === 'cartao' ? 'creditCard' : 'bankSlip'];
    if (!taxas) {
      // Taxas não configuradas na conta Asaas
      return calcularTotal(metodo, base, null, Date.now(), parcelas);
    }
    const total = calcularTotal(metodo, base, taxas, Date.now(), parcelas);
    return { parcelas, valorBaseCentavos: base, acrescimoCentavos: total - base, totalCentavos: total };
  } catch (erro) {
    // Fallback silencioso: usa tarifas padrão
    return calcularTotal(metodo, base, null, Date.now(), parcelas);
  }
}
