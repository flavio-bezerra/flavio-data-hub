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
import SubtleBackground from "@/components/SubtleBackground";
import { useLanguage } from "@/contexts/LanguageContext";

const RoiCalculator = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
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
      <SubtleBackground />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div
          className={`max-w-4xl mx-auto mb-16 text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text leading-tight pb-2">
            {t.roiCalculator.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t.roiCalculator.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">

          {/* Lado Esquerdo: CUSTOS (Investimento) */}
          <div className={`lg:col-span-5 space-y-6 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-wine/20 rounded-lg"><Calculator className="w-6 h-6 text-wine" /></div>
                <h3 className="text-2xl font-bold text-wine">{t.roiCalculator.investment.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.roiCalculator.investment.description}
              </p>
            </div>

            <Card className="p-6 bg-card/50 border-wine/20 hover:border-wine/50 transition-all hover:-translate-y-1">
              <div className="flex gap-4">
                <Users className="w-8 h-8 text-wine-light shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">{t.roiCalculator.investment.people.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.roiCalculator.investment.people.description}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-wine/20 hover:border-wine/50 transition-all hover:-translate-y-1">
              <div className="flex gap-4">
                <Server className="w-8 h-8 text-wine-light shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">{t.roiCalculator.investment.technology.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.roiCalculator.investment.technology.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Centro: Símbolo de VS/Operação */}
          <div className={`lg:col-span-2 flex flex-col items-center justify-center gap-4 text-muted-foreground/50 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
            <ArrowRight className="w-10 h-10 lg:rotate-0 rotate-90 hidden sm:block" />
            <div className="text-xs font-mono uppercase tracking-widest">{t.roiCalculator.generates}</div>
            <ArrowRight className="w-10 h-10 lg:rotate-0 rotate-90 hidden sm:block" />
          </div>

          {/* Lado Direito: GANHOS (Retorno) */}
          <div className={`lg:col-span-5 space-y-6 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/20 rounded-lg"><PiggyBank className="w-6 h-6 text-gold" /></div>
                <h3 className="text-2xl font-bold text-gold">{t.roiCalculator.return.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.roiCalculator.return.description}
              </p>
            </div>

            <div className="grid gap-4">
              <Card className="p-4 border-gold/20 bg-card/50 hover:bg-gold/5 transition-colors">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">{t.roiCalculator.return.revenue.title}</h4>
                    <p className="text-sm text-muted-foreground">{t.roiCalculator.return.revenue.description}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-gold/20 bg-card/50 hover:bg-gold/5 transition-colors">
                <div className="flex items-start gap-3">
                  <Banknote className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">{t.roiCalculator.return.pnl.title}</h4>
                    <p className="text-sm text-muted-foreground">{t.roiCalculator.return.pnl.description}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-gold/20 bg-card/50 hover:bg-gold/5 transition-colors">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">{t.roiCalculator.return.efficiency.title}</h4>
                    <p className="text-sm text-muted-foreground">{t.roiCalculator.return.efficiency.description}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-gold/20 bg-card/50 hover:bg-gold/5 transition-colors">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">{t.roiCalculator.return.losses.title}</h4>
                    <p className="text-sm text-muted-foreground">{t.roiCalculator.return.losses.description}</p>
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
                  {t.roiCalculator.formula.title}
                </h3>
                <Crown className="w-6 h-6 text-gold animate-pulse" />
              </div>

              {/* A Equação */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-lg sm:text-2xl md:text-3xl font-bold font-mono text-foreground">

                {/* Fração Matemática */}
                <div className="flex flex-col items-center justify-center">
                  <div className="border-b-2 border-border px-2 pb-2 mb-2 tracking-tight">
                    (<span className="text-gold">{t.roiCalculator.formula.gains}</span> - <span className="text-wine-light">{t.roiCalculator.formula.costs}</span>)
                  </div>
                  <div className="px-2 text-wine-light tracking-tight">{t.roiCalculator.formula.costs}</div>
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
                <span className="text-gold font-semibold">{t.roiCalculator.formula.rule}</span> {t.roiCalculator.formula.ruleText}
              </p>
            </Card>
          </div>
        </div>

      </div>
      <div className="text-center mt-12 relative z-10">
        <p className="text-lg text-muted-foreground italic">
          {t.roiCalculator.finalText}
        </p>
      </div>
    </section>
  );
};

export default RoiCalculator;