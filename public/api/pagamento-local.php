<?php
declare(strict_types=1);

/**
 * Cálculo local de tarifas de pagamento (sem depender da API Asaas).
 * Regras fixas conforme contrato:
 * - Boleto: R$ 1,69 fixo por cobrança
 * - Pix: R$ 1,89 fixo por cobrança
 * - Cartão de Crédito: 2,89% sobre o valor + R$ 0,00
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function responder(int $status, array $payload): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

// Taxas fixas (em centavos)
const TAXA_BOLETO_CENTAVOS = 169;      // R$ 1,69
const TAXA_PIX_CENTAVOS = 189;         // R$ 1,89
const TAXA_CARTAO_PERCENTUAL = 2.89;   // 2,89%
const TAXA_CARTAO_FIXO_CENTAVOS = 0;   // R$ 0,00

function centavos(float $valor): int {
    return (int) round($valor * 100);
}

function formatarReais(int $centavos): string {
    return number_format($centavos / 100, 2, ',', '.');
}

try {
    // Verifica origem
    $origem = $_SERVER['HTTP_ORIGIN'] ?? '';
    $permitidas = ['https://casamento-flavio-victoria.com.br', 'https://www.casamento-flavio-victoria.com.br'];
    if (!in_array($origem, $permitidas, true)) {
        responder(403, ['ok' => false, 'message' => 'Origem inválida.']);
    }

    // Verifica método
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        responder(405, ['ok' => false, 'message' => 'Método não permitido.']);
    }

    // Valida Content-Type
    $contentType = strtolower(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]);
    if ($contentType !== 'application/json') {
        responder(415, ['ok' => false, 'message' => 'Envie JSON.']);
    }

    // Lê corpo
    $raw = file_get_contents('php://input', false, null, 0, 65537);
    if (strlen($raw) > 65536) {
        responder(413, ['ok' => false, 'message' => 'Solicitação muito grande.']);
    }
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        responder(422, ['ok' => false, 'message' => 'Corpo inválido.']);
    }

    // Parâmetros
    $presenteId = $body['presenteId'] ?? null;
    $valor = $body['valor'] ?? null;
    $parcelas = isset($body['parcelas']) ? (int) $body['parcelas'] : 1;
    $tipo = $body['tipo'] ?? ''; // 'pix', 'boleto', 'cartao'

    if (!is_string($tipo) || !in_array($tipo, ['pix', 'boleto', 'cartao'], true)) {
        responder(422, ['ok' => false, 'message' => 'Tipo de pagamento inválido. Use: pix, boleto ou cartao.']);
    }

    if (!is_numeric($valor)) {
        responder(422, ['ok' => false, 'message' => 'Valor inválido.']);
    }

    $valorCentavos = (int) round((float) $valor * 100);
    if ($valorCentavos < 1000) { // mínimo R$ 10,00
        responder(422, ['ok' => false, 'message' => 'Valor mínimo é R$ 10,00.']);
    }

    if ($tipo === 'cartao') {
        if ($parcelas < 1 || $parcelas > 21) {
            responder(422, ['ok' => false, 'message' => 'Parcelas inválidas (1 a 21).']);
        }
    }

    // Cálculo das taxas
    $taxaCentavos = 0;
    $taxaDescricao = '';

    if ($tipo === 'boleto') {
        $taxaCentavos = TAXA_BOLETO_CENTAVOS;
        $taxaDescricao = 'R$ ' . formatarReais(TAXA_BOLETO_CENTAVOS) . ' por cobrança';
    } elseif ($tipo === 'pix') {
        $taxaCentavos = TAXA_PIX_CENTAVOS;
        $taxaDescricao = 'R$ ' . formatarReais(TAXA_PIX_CENTAVOS) . ' por Pix';
    } elseif ($tipo === 'cartao') {
        $percentual = TAXA_CARTAO_PERCENTUAL / 100;
        $taxaPercentual = (int) round($valorCentavos * $percentual);
        $taxaCentavos = $taxaPercentual + TAXA_CARTAO_FIXO_CENTAVOS;
        $taxaDescricao = TAXA_CARTAO_PERCENTUAL . '% sobre o valor';
        if (TAXA_CARTAO_FIXO_CENTAVOS > 0) {
            $taxaDescricao .= ' + R$ ' . formatarReais(TAXA_CARTAO_FIXO_CENTAVOS);
        }
    }

    $totalCentavos = $valorCentavos + $taxaCentavos;
    $valorLiquidoCentavos = $valorCentavos; // o convidado paga o total, o casal recebe o valor líquido

    // Para cartão, calcula parcelas se informado
    $parcelasInfo = null;
    if ($tipo === 'cartao' && isset($_POST['parcelas']) && (int)$_POST['parcelas'] > 1) {
        $parcelas = max(1, min(21, (int)$_POST['parcelas']));
        $valorParcelaCentavos = (int) round($totalCentavos / $parcelas);
        $parcelasInfo = [
            'quantidade' => $parcelas,
            'valorParcelaCentavos' => $valorParcelaCentavos,
            'valorParcelaFormatado' => formatarReais($valorParcelaCentavos),
        ];
    }

    $resposta = [
        'ok' => true,
        'valorPresenteCentavos' => $valorCentavos,
        'valorPresenteFormatado' => formatarReais($valorCentavos),
        'taxaCentavos' => $taxaCentavos,
        'taxaFormatada' => formatarReais($taxaCentavos),
        'taxaDescricao' => $taxaDescricao,
        'totalCentavos' => $totalCentavos,
        'totalFormatado' => formatarReais($totalCentavos),
        'valorLiquidoCentavos' => $valorLiquidoCentavos,
        'valorLiquidoFormatado' => formatarReais($valorLiquidoCentavos),
        'recebimento' => match ($tipo) {
            'boleto' => '1 dia útil após o pagamento',
            'pix' => 'Poucos segundos após o pagamento',
            'cartao' => '30 dias após o pagamento de cada parcela',
        },
    ];

    if ($parcelasInfo) {
        $resposta['parcelas'] = $parcelasInfo;
    }

    responder(200, $resposta);

} catch (Throwable $e) {
    responder(500, ['ok' => false, 'message' => 'Erro interno no cálculo de taxas.']);
}