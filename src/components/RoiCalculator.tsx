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
  Equal
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
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

        {/* Fórmula ROI */}
                <div className={`mt-16 max-w-3xl mx-auto transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Card className="p-8 bg-secondary/50 backdrop-blur-sm border-primary/30 text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent group-hover:via-primary/10 transition-all duration-500"></div>
             
             <h3 className="text-xl text-muted-foreground mb-6 relative z-10">A Fórmula de Ouro</h3>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-2xl sm:text-3xl md:text-4xl font-bold font-mono relative z-10">
                <div className="flex flex-col items-center">
                  <span className="border-b-2 border-foreground px-4 mb-2">(Ganhos - Custos)</span>
                  <span>Custos</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gold">× 100</span>
                  <Equal className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  <span className="text-primary animate-pulse">% ROI</span>
                </div>
             </div>
             <p className="mt-6 text-sm text-muted-foreground relative z-10">
               *Um projeto viável deve ter um ROI positivo claro, pagando seu investimento em curto/médio prazo.
             </p>
          </Card>
        </div>

      </div>
    </section>
  );
};

export default RoiCalculator;