import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Server, 
  ShieldCheck, 
  Clock, 
  PiggyBank, 
  Banknote,
  ArrowRight,
  Crown,
  X
} from "lucide-react";

const RoiCalculator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-background relative overflow-hidden border-t border-border/50"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div
          className={`max-w-4xl mx-auto mb-16 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text leading-tight pb-2">
            Priorização pelo ROI
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            Em um mar de possibilidades, como escolhemos qual projeto atacar? A resposta é financeira.
            Priorizamos iniciativas onde a mensuração do retorno é <span className="text-foreground font-semibold">fácil, concreta e supera o investimento</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Lado Esquerdo: CUSTOS (Investimento) */}
          <div className={`lg:col-span-5 space-y-6 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-wine/20 rounded-lg"><Calculator className="w-6 h-6 text-wine" /></div>
              <h3 className="text-2xl font-bold text-wine">1. Investimento (Custos)</h3>
            </div>

            <Card className="p-6 bg-card/50 border-wine/20 hover:border-wine/50 transition-all hover:-translate-y-1">
              <div className="flex gap-4">
                <Users className="w-8 h-8 text-wine-light shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Pessoas (Horas-Homem)</h4>
                  <p className="text-sm text-muted-foreground">
                    Cálculo: <code>(Horas dedicadas × Valor Hora do Profissional)</code>. Inclui Data Scientists, Engenheiros e Stakeholders envolvidos.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-wine/20 hover:border-wine/50 transition-all hover:-translate-y-1">
              <div className="flex gap-4">
                <Server className="w-8 h-8 text-wine-light shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Infraestrutura & Tools</h4>
                  <p className="text-sm text-muted-foreground">
                    Custo computacional (Cloud/GPU), armazenamento e licenças de software necessárias para rodar o modelo.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Centro: Símbolo de VS/Operação */}
          <div className={`lg:col-span-2 flex flex-col items-center justify-center gap-4 text-muted-foreground/50 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
            <ArrowRight className="w-10 h-10 lg:rotate-0 rotate-90 hidden sm:block" />
            <div className="text-xs font-mono uppercase tracking-widest">Gera</div>
            <ArrowRight className="w-10 h-10 lg:rotate-0 rotate-90 hidden sm:block" />
          </div>

          {/* Lado Direito: GANHOS (Retorno) */}
          <div className={`lg:col-span-5 space-y-6 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gold/20 rounded-lg"><PiggyBank className="w-6 h-6 text-gold" /></div>
              <h3 className="text-2xl font-bold text-gold">2. Retorno (Ganhos)</h3>
            </div>

            <div className="grid gap-4">
              <Card className="p-4 border-gold/20 bg-card/50 hover:bg-gold/5 transition-colors">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">Incremento de Vendas</h4>
                    <p className="text-sm text-muted-foreground">Novas receitas geradas diretamente pelo modelo (ex: Recomendação).</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-gold/20 bg-card/50 hover:bg-gold/5 transition-colors">
                <div className="flex items-start gap-3">
                  <Banknote className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">Hard Saving</h4>
                    <p className="text-sm text-muted-foreground">Dinheiro que sai do orçamento. Redução direta de custo (ex: Menor estoque).</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-gold/20 bg-card/50 hover:bg-gold/5 transition-colors">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">Soft Saving</h4>
                    <p className="text-sm text-muted-foreground">Ganho de eficiência. O time faz mais em menos tempo (ex: Automação).</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-gold/20 bg-card/50 hover:bg-gold/5 transition-colors">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">Cost Avoidance</h4>
                    <p className="text-sm text-muted-foreground">Custos futuros evitados (ex: Prevenção de multas, churn ou fraudes).</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Fórmula ROI - Redesenhada */}
        <div className={`mt-20 max-w-4xl mx-auto transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Wrapper com Gradiente na Borda */}
          <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-primary/30 via-gold/30 to-primary/30 shadow-2xl">
            <Card className="relative p-8 sm:p-10 bg-black/40 backdrop-blur-xl border-none rounded-2xl text-center overflow-hidden">
               
               {/* Efeito de Glow Interno */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent blur-sm"></div>
               
               <div className="flex items-center justify-center gap-3 mb-8">
                 <Crown className="w-6 h-6 text-gold animate-pulse" />
                 <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-gold to-foreground tracking-wide">
                   A FÓRMULA DE OURO
                 </h3>
                 <Crown className="w-6 h-6 text-gold animate-pulse" />
               </div>

               {/* A Equação */}
               <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-lg sm:text-2xl md:text-3xl font-bold font-mono text-foreground">
                  
                  {/* Fração Matemática */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="border-b-2 border-border px-2 pb-2 mb-2 tracking-tight">
                      (<span className="text-gold">Ganhos</span> - <span className="text-wine-light">Custos</span>)
                    </div>
                    <div className="px-2 text-wine-light tracking-tight">Custos</div>
                  </div>

                  {/* Multiplicador */}
                  <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                    <X className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                    <span className="text-foreground">100</span>
                  </div>

                  {/* Resultado */}
                  <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                    <span className="text-muted-foreground text-4xl sm:text-5xl font-light">=</span>
                    <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      % ROI
                    </div>
                  </div>
               </div>

               <p className="mt-8 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                 <span className="text-gold font-semibold">*Regra de Ouro:</span> Um projeto de dados viável deve ter um ROI positivo claro, pagando seu investimento em curto/médio prazo e gerando valor exponencial ao longo do tempo.
               </p>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RoiCalculator;