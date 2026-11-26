import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createPortal } from "react-dom";
import ResumoPresente from "./ResumoPresente";
import type { PresenteItem } from "../casamento/conteudo";

interface ModalPagamentoProps {
  presente: PresenteItem | null;
  onClose: () => void;
}

type MetodoPagamento = "pix" | "cartao" | "boleto";

interface RespostaPix {
  cobrancaId: string;
  valor: number;
  pixCopiaECola: string;
  qrCodeBase64: string | null;
  invoiceUrl?: string;
  ambiente: "sandbox" | "producao";
}

interface RespostaBoleto {
  cobrancaId: string;
  valor: number;
  linhaDigitavel: string;
  codigoBarras: string;
  bankSlipUrl: string;
  invoiceUrl?: string;
  vencimento: string;
  ambiente: "sandbox" | "producao";
}

interface OpcaoCartao {
  parcelas: number;
  valorBaseCentavos: number;
  acrescimoCentavos: number;
  totalCentavos: number;
}

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatarCentavos = (valor: number) => reais.format(valor / 100);

interface RespostaCartao {
  cobrancaId: string;
  status: string;
  pago: boolean;
  valor: number;
  parcelas: number;
  ambiente: "sandbox" | "producao";
}

function formatarCpf(v: string): string {
  const nums = v.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

function formatarCartao(v: string): string {
  const nums = v.replace(/\D/g, "").slice(0, 16);
  return nums.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatarValidade(v: string): string {
  const nums = v.replace(/\D/g, "").slice(0, 4);
  if (nums.length <= 2) return nums;
  return `${nums.slice(0, 2)}/${nums.slice(2)}`;
}

export default function ModalPagamento({ presente, onClose }: ModalPagamentoProps) {
  const [metodo, setMetodo] = useState<MetodoPagamento>("pix");
  const [etapa, setEtapa] = useState<"formulario" | "processando" | "pix_resultado" | "boleto_resultado" | "sucesso" | "pendente" | "erro">("formulario");

  // Dados do convidado
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [valorLivre, setValorLivre] = useState("100");

  // Dados do cartão
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [validade, setValidade] = useState("");
  const [ccv, setCcv] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [cotacao, setCotacao] = useState<{ chave: string; opcoes: OpcaoCartao[]; erro?: string } | null>(null);
  const [tentativaCotacao, setTentativaCotacao] = useState(0);
  const [cep, setCep] = useState("");
  const [numeroEndereco, setNumeroEndereco] = useState("");

  // Resultados
  const [dadosPix, setDadosPix] = useState<RespostaPix | null>(null);
  const [dadosBoleto, setDadosBoleto] = useState<RespostaBoleto | null>(null);
  const [dadosCartao, setDadosCartao] = useState<RespostaCartao | null>(null);
  const [mensagemErro, setMensagemErro] = useState("");
  const [copiado, setCopiado] = useState(false);
  const pollingRef = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const valorEfetivo = presente?.livre ? Number(valorLivre) || 0 : presente?.valor || 0;
  const presenteId = presente?.id;
  const chaveCotacao = `${metodo}:${presenteId}:${valorEfetivo}:${tentativaCotacao}`;
  const cotacaoAtual = cotacao?.chave === chaveCotacao ? cotacao : null;
  const opcaoCartao = cotacaoAtual?.opcoes.find((opcao) => opcao.parcelas === parcelas) ?? cotacaoAtual?.opcoes[0];

  useEffect(() => {
    if (etapa !== 'formulario' || !presenteId || !Number.isFinite(valorEfetivo) || valorEfetivo < 10) return;
    const controle = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const resp = await fetch(`/api/pagamento/${metodo}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ acao: 'cotacao', presenteId, valor: valorEfetivo }),
          signal: controle.signal,
        });
        const data = await resp.json();
        if (!resp.ok || !data.ok || !Array.isArray(data.opcoes) || !data.opcoes.length) throw new Error();
        if (!controle.signal.aborted) setCotacao({ chave: chaveCotacao, opcoes: data.opcoes });
      } catch {
        if (!controle.signal.aborted) setCotacao({ chave: chaveCotacao, opcoes: [], erro: 'Não foi possível consultar a tarifa desta forma de pagamento.' });
      }
    }, 350);
    return () => { window.clearTimeout(timer); controle.abort(); };
  }, [metodo, etapa, presenteId, valorEfetivo, chaveCotacao]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    function manterFoco(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const elements = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]');
      if (!elements?.length) { event.preventDefault(); dialogRef.current?.focus(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", manterFoco);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", manterFoco); previousFocus?.focus(); };
  }, []);

  // Fechar no Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Polling para Pix
  useEffect(() => {
    if (etapa !== "pix_resultado" || !dadosPix?.cobrancaId) return;

    const interval = window.setInterval(async () => {
      try {
        const resp = await fetch(`/api/pagamento/status?id=${encodeURIComponent(dadosPix.cobrancaId)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.pago) {
            setEtapa("sucesso");
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        }
      } catch {
        // silencioso
      }
    }, 3000);

    pollingRef.current = interval;
    return () => clearInterval(interval);
  }, [etapa, dadosPix]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!opcaoCartao) return;
    setMensagemErro("");
    setEtapa("processando");

    try {
      if (metodo === "pix") {
        const resp = await fetch("/api/pagamento/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            presenteId: presente?.id,
            nome,
            email,
            cpf,
            mensagem,
            valor: valorEfetivo,
            totalAceitoCentavos: opcaoCartao.totalCentavos
          })
        });

        const data = await resp.json();
        if (!resp.ok || !data.ok) {
          if (resp.status === 409 || resp.status === 503) setTentativaCotacao((atual) => atual + 1);
          throw new Error(data.message || "Erro ao gerar cobrança Pix.");
        }

        setDadosPix(data);
        setEtapa("pix_resultado");
      } else if (metodo === "boleto") {
        const resp = await fetch("/api/pagamento/boleto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            presenteId: presente?.id,
            nome,
            email,
            cpf,
            mensagem,
            valor: valorEfetivo,
            totalAceitoCentavos: opcaoCartao.totalCentavos
          })
        });

        const data = await resp.json();
        if (!resp.ok || !data.ok) {
          if (resp.status === 409 || resp.status === 503) setTentativaCotacao((atual) => atual + 1);
          throw new Error(data.message || "Erro ao emitir boleto bancário.");
        }

        setDadosBoleto(data);
        setEtapa("boleto_resultado");
      } else if (metodo === "cartao" && opcaoCartao) {
        const [mes, ano] = validade.split("/");
        const resp = await fetch("/api/pagamento/cartao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            presenteId: presente?.id,
            nome,
            email,
            cpf,
            mensagem,
            valor: valorEfetivo,
            parcelas: opcaoCartao.parcelas,
            totalAceitoCentavos: opcaoCartao.totalCentavos,
            cep,
            numeroEndereco,
            cartao: {
              numero: numeroCartao,
              nomeTitular,
              mesExpiracao: mes,
              anoExpiracao: ano,
              ccv
            }
          })
        });

        const data = await resp.json();
        if (!resp.ok || !data.ok) {
          if (resp.status === 409 || resp.status === 503) setTentativaCotacao((atual) => atual + 1);
          throw new Error(data.message || "Transação de cartão recusada.");
        }

        setDadosCartao(data);
        setEtapa(data.pago === true ? "sucesso" : "pendente");
        setNumeroCartao("");
        setCcv("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
      setMensagemErro(msg);
      setEtapa("erro");
    }
  }

  async function copiarTexto(texto: string) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(texto);
      } else {
        const input = document.createElement("textarea");
        input.value = texto;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      // erro cópia
    }
  }

  if (!presente) return null;

  return createPortal(
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      className="pagamento-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pagamento-folha">
        <ResumoPresente presente={presente} valor={valorEfetivo} />
        <div className="pagamento-conteudo">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar pagamento"
          className="absolute top-4 right-4 text-2xl leading-none text-[#34506a] hover:text-[#1e293b] p-2"
        >
          &times;
        </button>

        <p className="text-xs uppercase tracking-widest text-[#5c6f84] font-serif mb-1">
          Presente de Casamento
        </p>
        <h2 id="modal-titulo" className="text-2xl sm:text-3xl font-serif text-[#1e3a5f] mb-2">
          Seu presente
        </h2>

        {etapa === "formulario" && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
            <p className="text-sm text-slate-600 font-serif italic mb-3">
              {presente.descricao}
            </p>

            {/* Seletor de Valor */}
            {presente.livre ? (
              <div>
                <label htmlFor="valorLivre" className="block text-sm font-semibold text-[#1e3a5f] mb-1">
                  Valor da sua contribuição (R$) *
                </label>
                <input
                  id="valorLivre"
                  type="number"
                  min="10"
                  step="5"
                  required
                  value={valorLivre}
                  onChange={(e) => setValorLivre(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none text-lg font-serif"
                />
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                <span className="text-sm text-slate-600">Valor do presente:</span>
                <span className="text-xl font-serif font-semibold text-[#1e3a5f]">
                  {presente.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            )}

            {/* Abas de Escolha do Meio de Pagamento */}
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#1e3a5f] font-semibold mb-2">
                Forma de pagamento:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMetodo("pix")}
                  className={`py-2 px-3 text-xs sm:text-sm font-serif border rounded transition-colors ${
                    metodo === "pix"
                      ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  Pix
                </button>
                <button
                  type="button"
                  onClick={() => setMetodo("cartao")}
                  className={`py-2 px-3 text-xs sm:text-sm font-serif border rounded transition-colors ${
                    metodo === "cartao"
                      ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  Cartão
                </button>
                <button
                  type="button"
                  onClick={() => setMetodo("boleto")}
                  className={`py-2 px-3 text-xs sm:text-sm font-serif border rounded transition-colors ${
                    metodo === "boleto"
                      ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  Boleto
                </button>
              </div>
            </div>

            {/* Informações Básicas do Convidado */}
            <div className="space-y-3 pt-1">
              <div>
                <label htmlFor="nomeConvidado" className="block text-sm font-medium text-[#1e3a5f] mb-1">
                  Seu nome completo *
                </label>
                <input
                  id="nomeConvidado"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como gostaria de ser identificado(a)"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="emailConvidado" className="block text-sm font-medium text-[#1e3a5f] mb-1">
                    Seu e-mail *
                  </label>
                  <input
                    id="emailConvidado"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Para o recibo"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="cpfConvidado" className="block text-sm font-medium text-[#1e3a5f] mb-1">
                    CPF *
                  </label>
                  <input
                    id="cpfConvidado"
                    type="text"
                    required
                    maxLength={14}
                    value={cpf}
                    onChange={(e) => setCpf(formatarCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Campos Específicos para Cartão de Crédito */}
            {metodo === "cartao" && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="block text-xs font-semibold text-[#1e3a5f] uppercase tracking-wider">
                  Dados do Cartão de Crédito
                </span>

                <div>
                  <label htmlFor="numCartao" className="block text-xs text-slate-700 mb-1">
                    Número do Cartão *
                  </label>
                  <input
                    id="numCartao"
                    type="text"
                    required
                    maxLength={19}
                    value={numeroCartao}
                    onChange={(e) => setNumeroCartao(formatarCartao(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="titularCartao" className="block text-xs text-slate-700 mb-1">
                    Nome impresso no Cartão *
                  </label>
                  <input
                    id="titularCartao"
                    type="text"
                    required
                    value={nomeTitular}
                    onChange={(e) => setNomeTitular(e.target.value.toUpperCase())}
                    placeholder="NOME COMO NO CARTAO"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="validadeCartao" className="block text-xs text-slate-700 mb-1">
                      Validade (MM/AA) *
                    </label>
                    <input
                      id="validadeCartao"
                      type="text"
                      required
                      maxLength={5}
                      value={validade}
                      onChange={(e) => setValidade(formatarValidade(e.target.value))}
                      placeholder="MM/AA"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="ccvCartao" className="block text-xs text-slate-700 mb-1">
                      CVV *
                    </label>
                    <input
                      id="ccvCartao"
                      type="password"
                      required
                      maxLength={4}
                      value={ccv}
                      onChange={(e) => setCcv(e.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="parcelasCartao" className="block text-xs text-slate-700 mb-1">
                      Parcelamento
                    </label>
                    <select
                      id="parcelasCartao"
                      value={opcaoCartao?.parcelas ?? ''}
                      disabled={!opcaoCartao}
                      onChange={(e) => setParcelas(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none text-sm"
                    >
                      {!opcaoCartao && <option value="">Sem cotação</option>}
                      {cotacaoAtual?.opcoes.map((opcao) => (
                        <option key={opcao.parcelas} value={opcao.parcelas}>
                          {opcao.parcelas === 1 ? 'À vista' : `${opcao.parcelas} parcelas`} · {formatarCentavos(opcao.totalCentavos)} no total
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cepCartao" className="block text-xs text-slate-700 mb-1">
                      CEP da fatura
                    </label>
                    <input
                      id="cepCartao"
                      type="text"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="mensagemCarinho" className="block text-sm font-medium text-[#1e3a5f] mb-1">
                Mensagem aos noivos (opcional)
              </label>
              <textarea
                id="mensagemCarinho"
                rows={2}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Deixe um recado com carinho para Victória & Flávio..."
                className="w-full px-3 py-2 border border-slate-300 rounded focus:border-[#1e3a5f] focus:outline-none text-sm"
              />
            </div>

            {
              <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700" aria-live="polite">
                {opcaoCartao ? (
                  <dl className="space-y-1">
                    <div className="flex justify-between gap-2"><dt>Valor do presente</dt><dd>{formatarCentavos(opcaoCartao.valorBaseCentavos)}</dd></div>
                    <div className="flex justify-between gap-2"><dt>Tarifa {metodo === 'pix' ? 'do Pix' : metodo === 'boleto' ? 'do boleto' : 'do cartão'}</dt><dd>{formatarCentavos(opcaoCartao.acrescimoCentavos)}</dd></div>
                    <div className="flex justify-between gap-2 font-semibold"><dt>Total a pagar</dt><dd>{formatarCentavos(opcaoCartao.totalCentavos)}</dd></div>
                    {opcaoCartao.parcelas > 1 && <div className="flex justify-between gap-2"><dt>{opcaoCartao.parcelas} parcelas{opcaoCartao.totalCentavos % opcaoCartao.parcelas ? ' (aprox.)' : ''}</dt><dd>{formatarCentavos(Math.round(opcaoCartao.totalCentavos / opcaoCartao.parcelas))} cada</dd></div>}
                  </dl>
                ) : cotacaoAtual?.erro ? (
                  <><p>{cotacaoAtual.erro}</p><button type="button" className="underline" onClick={() => setTentativaCotacao((atual) => atual + 1)}>Tentar novamente</button></>
                ) : <p>{valorEfetivo >= 10 ? 'Calculando o total…' : 'Informe um valor a partir de R$ 10,00.'}</p>}
              </div>
            }
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={!opcaoCartao}
                className="flex-1 min-h-[48px] px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-base font-serif rounded transition-colors disabled:opacity-50"
              >
                {metodo === "pix" && "Gerar Pix para presentear"}
                {metodo === "cartao" && (opcaoCartao ? `Pagar ${formatarCentavos(opcaoCartao.totalCentavos)} no cartão` : 'Pagar no cartão')}
                {metodo === "boleto" && "Emitir Boleto Bancário"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-serif underline underline-offset-4"
              >
                Voltar à lista
              </button>
            </div>
          </form>
        )}

        {etapa === "processando" && (
          <div className="py-12 text-center space-y-4">
            <div className="inline-block w-8 h-8 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-serif text-[#1e3a5f]">
              Processando sua contribuição com carinho...
            </p>
            <p className="text-xs text-slate-500">
              Conectando com segurança ao gateway Asaas.
            </p>
          </div>
        )}

        {/* Tela Resultado Pix */}
        {etapa === "pix_resultado" && dadosPix && (
          <div className="mt-4 text-center space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-sm font-serif">
              Cobrança Pix gerada no valor de{" "}
              <strong>
                {dadosPix.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </strong>
            </div>

            {/* QR Code Vetorial nativo via QRCodeSVG */}
            <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded">
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <QRCodeSVG
                  value={dadosPix.pixCopiaECola}
                  size={192}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <span className="text-xs text-slate-500 mt-2">
                Abra o app do seu banco e aponte a câmera para o QR Code
              </span>
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="codigoPix" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Pix Copia e Cola:
              </label>
              <div className="flex gap-2">
                <input
                  id="codigoPix"
                  type="text"
                  readOnly
                  value={dadosPix.pixCopiaECola}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-slate-100 border border-slate-300 rounded text-slate-800 select-all"
                />
                <button
                  type="button"
                  onClick={() => copiarTexto(dadosPix.pixCopiaECola)}
                  className="min-h-[44px] px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  {copiado ? "Copiado!" : "Copiar código Pix"}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Aguardando confirmação do pagamento...
            </div>
          </div>
        )}

        {/* Tela Resultado Boleto */}
        {etapa === "boleto_resultado" && dadosBoleto && (
          <div className="mt-4 text-center space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm font-serif">
              Boleto emitido no valor de{" "}
              <strong>
                {dadosBoleto.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </strong>
            </div>

            {dadosBoleto.linhaDigitavel && (
              <div className="space-y-2 text-left">
                <label htmlFor="linhaDig" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Linha Digitável (Código de barras):
                </label>
                <div className="flex gap-2">
                  <input
                    id="linhaDig"
                    type="text"
                    readOnly
                    value={dadosBoleto.linhaDigitavel}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-slate-100 border border-slate-300 rounded text-slate-800 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copiarTexto(dadosBoleto.linhaDigitavel)}
                    className="min-h-[44px] px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors whitespace-nowrap"
                  >
                    {copiado ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              {dadosBoleto.bankSlipUrl && (
                <a
                  href={dadosBoleto.bankSlipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-serif rounded text-sm transition-colors"
                >
                  Visualizar / Imprimir Boleto (PDF) ↗
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 font-serif underline text-sm"
              >
                Concluir
              </button>
            </div>
          </div>
        )}

        {etapa === "pendente" && (
          <div className="py-8 text-center space-y-4" role="status">
            <h3 className="text-2xl font-serif">Pagamento em análise</h3>
            <p>A solicitação foi recebida, mas o pagamento ainda não foi confirmado. Evite enviar outra cobrança.</p>
            <button type="button" className="presente-aquarela-acao" onClick={onClose}>Voltar aos presentes</button>
          </div>
        )}
        {/* Tela Sucesso (Cartão confirmado ou Pix pago) */}
        {etapa === "sucesso" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-serif text-[#1e3a5f]">Muito obrigado pelo carinho!</h3>
            <p className="text-sm text-slate-600 font-serif leading-relaxed max-w-sm mx-auto">
              Seu presente foi confirmado com sucesso. Victória & Flávio agradecem imensamente por fazer parte deste momento tão especial!
            </p>
            {dadosCartao && (
              <p className="text-xs text-slate-500 font-mono">
                Transação: {dadosCartao.cobrancaId} · {reais.format(dadosCartao.valor)} no total · {dadosCartao.parcelas === 1 ? 'À vista' : `${dadosCartao.parcelas} parcelas`}
              </p>
            )}
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-serif rounded"
              >
                Concluir
              </button>
            </div>
          </div>
        )}

        {/* Tela Erro */}
        {etapa === "erro" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
              !
            </div>
            <h3 className="text-xl font-serif text-rose-800">Não foi possível prosseguir</h3>
            <p className="text-sm text-slate-600">{mensagemErro}</p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setEtapa("formulario")}
                className="px-4 py-2 bg-[#1e3a5f] text-white text-sm font-serif rounded"
              >
                Tentar novamente
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 text-sm font-serif underline"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>, document.body
  );
}
