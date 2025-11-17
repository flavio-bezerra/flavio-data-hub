import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, Database, Filter, BrainCircuit, CheckCheck, Rocket } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { cn } from "@/lib/utils";
import crispDmImage from "@/assets/crisp-dm-cycle.png";

// Dados para as 6 etapas do CRISP-DM
const crispSteps = [
  {
    id: 0,
    icon: Briefcase,
    shortTitle: "1. Negócio",
    fullTitle: "1. Entendimento do Negócio (Business Understanding)",
    details: "Esta é a etapa mais crucial. Antes de escrever qualquer código, focamos em definir o problema de negócio, os objetivos e as métricas de sucesso (KPIs).",
    color: "hsl(var(--primary))",
    value: 1,
    showInCycle: false // Fica fora do ciclo visual
  },
  {
    id: 1,
    icon: Database,
    shortTitle: "2. Dados",
    fullTitle: "2. Entendimento dos Dados (Data Understanding)",
    details: "Agimos como detetives, coletando e explorando os dados para identificar qualidade, disponibilidade e padrões iniciais. Respondemos: 'Os dados são suficientes?'.",
    color: "hsl(var(--gold))",
    value: 1,
    showInCycle: true
  },
  {
    id: 2,
    icon: Filter,
    shortTitle: "3. Preparação",
    fullTitle: "3. Preparação dos Dados (Data Preparation)",
    details: "Frequentemente a etapa mais demorada (90% do trabalho). Aqui limpamos, formatamos, enriquecemos e transformamos os dados brutos (features) para o modelo consumir.",
    color: "hsl(var(--primary))",
    value: 1,
    showInCycle: true
  },
  {
    id: 3,
    icon: BrainCircuit,
    shortTitle: "4. Modelagem",
    fullTitle: "4. Modelagem (Modeling)",
    details: "Aqui o Machine Learning acontece. Selecionamos, treinamos e ajustamos (fine-tuning) algoritmos para encontrar o que melhor responde ao problema de negócio.",
    color: "hsl(var(--wine))",
    value: 1,
    showInCycle: true
  },
  {
    id: 4,
    icon: CheckCheck,
    shortTitle: "5. Avaliação",
    fullTitle: "5. Avaliação (Evaluation)",
    details: "Um modelo com 99% de acurácia pode ser inútil se não resolver o problema de negócio. Avaliamos o modelo contra as métricas da Etapa 1 e decidimos se ele está pronto.",
    color: "hsl(var(--gold))",
    value: 1,
    showInCycle: true
  },
  {
    id: 5,
    icon: Rocket,
    shortTitle: "6. Implantação",
    fullTitle: "6. Implantação (Deployment)",
    details: "O modelo só gera valor em produção. Esta etapa envolve colocar o modelo 'no ar' (como uma API) para consumo. O ciclo não termina aqui, pois iniciamos o monitoramento.",
    color: "hsl(var(--wine))",
    value: 1,
    showInCycle: false // Fica fora do ciclo visual
  }
];

const Methodology = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCrispStep, setActiveCrispStep] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        
        {/* Título da Seção */}
        <div
          className={`max-w-4xl mx-auto mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Minha Metodologia de Projeto
          </h2>
          <p className="text-xl text-muted-foreground text-center leading-relaxed">
            Um bom resultado não vem do acaso. Ele é fruto de um processo estruturado, 
            iterativo e focado no problema de negócio.
          </p>
        </div>

        {/* Bloco 1: CRISP-DM vs. Agile */}
        <div 
          className={`max-w-6xl mx-auto mb-16 p-8 bg-card rounded-lg border border-border shadow-lg transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-3xl font-bold mb-4 text-primary">Por que Data Science é Diferente de Agile?</h3>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              Metodologias Ágeis (como o Scrum) são excelentes para **Desenvolvimento de Software**, onde o objetivo final é claro (ex: "construir um botão de login"). O risco é o *tempo*.
            </p>
            <p>
              **Data Science é Pesquisa & Descoberta.** Não sabemos a resposta (ou se ela existe nos dados) quando começamos. O risco é a *viabilidade*.
            </p>
            <p className="text-foreground font-semibold">
              Por isso, usamos o <span className="text-gold">CRISP-DM</span>: um processo padrão da indústria focado em mitigar o risco da descoberta. Ele é iterativo como o Agile, mas força o foco total no entendimento do negócio e dos dados *antes* de construir a solução.
            </p>
          </div>
        </div>

        {/* Bloco 2: O Ciclo Interativo */}
        <div 
          className={`max-w-6xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            As 6 Etapas do Ciclo CRISP-DM
          </h3>

          {/* Visual Interativo do Ciclo CRISP-DM */}
          <div className="relative w-full max-w-5xl mx-auto mb-16">
            {/* Cards das Etapas 1 e 6 (fora do ciclo) */}
            <div className="flex justify-between items-center mb-8 gap-8">
              {/* Etapa 1 - Negócio */}
              <div 
                onClick={() => setActiveCrispStep(0)}
                className={cn(
                  "flex-1 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105",
                  activeCrispStep === 0 
                    ? "bg-primary/20 border-primary shadow-lg shadow-primary/30" 
                    : "bg-card/50 border-border/50 hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">Início</h4>
                </div>
                <p className="text-sm text-muted-foreground">Entendimento do Negócio</p>
              </div>

              {/* Etapa 6 - Implantação */}
              <div 
                onClick={() => setActiveCrispStep(5)}
                className={cn(
                  "flex-1 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105",
                  activeCrispStep === 5 
                    ? "bg-wine/20 border-wine shadow-lg shadow-wine/30" 
                    : "bg-card/50 border-border/50 hover:border-wine/50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-wine/20">
                    <Rocket className="w-6 h-6 text-wine" />
                  </div>
                  <h4 className="font-bold text-lg">Fim</h4>
                </div>
                <p className="text-sm text-muted-foreground">Implantação em Produção</p>
              </div>
            </div>

            {/* Gráfico de Rosca Interativo (apenas etapas 2-5) */}
            <div className="relative">
              {/* Texto Central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="text-center p-6 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-xl">
                  <p className="text-sm text-muted-foreground mb-1">Etapa</p>
                  <p className="text-4xl font-bold text-primary">{activeCrispStep + 1}</p>
                  <p className="text-xs text-muted-foreground mt-1">de 6</p>
                </div>
              </div>

              {/* Gráfico */}
              <div className="w-full h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <RechartsTooltip 
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-popover p-3 rounded-lg border-2 border-primary/50 shadow-xl backdrop-blur-sm">
                              <p className="text-popover-foreground font-bold text-sm">{payload[0].payload.fullTitle}</p>
                            </div>
                          );
                        }
                        return null;
                      }} 
                    />
                    <Pie
                      data={crispSteps.filter(step => step.showInCycle)}
                      dataKey="value"
                      nameKey="shortTitle"
                      cx="50%"
                      cy="50%"
                      innerRadius="45%"
                      outerRadius="75%"
                      cornerRadius={8}
                      paddingAngle={8}
                      onClick={(_, index) => {
                        // Mapear o índice do gráfico filtrado para o índice real
                        const realIndex = crispSteps.findIndex((step, i) => 
                          step.showInCycle && crispSteps.filter(s => s.showInCycle).indexOf(step) === index
                        );
                        setActiveCrispStep(realIndex);
                      }}
                    >
                      {crispSteps.filter(step => step.showInCycle).map((entry, index) => {
                        const realIndex = crispSteps.indexOf(entry);
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            opacity={activeCrispStep === realIndex ? 1 : 0.3}
                            className="cursor-pointer transition-all duration-300 hover:opacity-100"
                            stroke={activeCrispStep === realIndex ? entry.color : "transparent"}
                            strokeWidth={activeCrispStep === realIndex ? 3 : 0}
                            filter={activeCrispStep === realIndex ? "url(#glow)" : undefined}
                          />
                        );
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Acordeão Interativo */}
          <Accordion 
            type="single" 
            collapsible 
            className="w-full" 
            value={`item-${activeCrispStep}`}
            onValueChange={(val) => setActiveCrispStep(parseInt(val.replace('item-', '')) || 0)}
          >
            {crispSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AccordionItem value={`item-${index}`} key={index} className="border-border">
                  <AccordionTrigger 
                    className={cn(
                      "p-4 hover:no-underline rounded-lg hover:bg-card-foreground/5 data-[state=open]:bg-card-foreground/10",
                      activeCrispStep === index && "bg-card-foreground/10 ring-2 ring-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-4 w-full pr-4 text-left">
                      <div className="p-3 rounded-lg bg-card-foreground/10 text-primary">
                        <Icon className="w-6 h-6 shrink-0" />
                      </div>
                      <h4 className="flex-1 font-bold text-base md:text-lg text-foreground">{step.fullTitle}</h4>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-4 px-4 md:px-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.details}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

      </div>
    </section>
  );
};

export default Methodology;
