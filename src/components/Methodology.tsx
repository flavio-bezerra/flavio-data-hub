import { useEffect, useRef, useState } from "react";
import { Briefcase, Database, Filter, BrainCircuit, CheckCheck, Rocket, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Dados para as 6 etapas do CRISP-DM
const crispSteps = [
  {
    id: 0,
    icon: Briefcase,
    number: "1",
    shortTitle: "Entendimento do Negócio",
    fullTitle: "1. Entendimento do Negócio (Business Understanding)",
    details: "Esta é a etapa mais crucial. Antes de escrever qualquer código, focamos em definir o problema de negócio, os objetivos e as métricas de sucesso (KPIs).",
    color: "primary"
  },
  {
    id: 1,
    icon: Database,
    number: "2",
    shortTitle: "Entendimento dos Dados",
    fullTitle: "2. Entendimento dos Dados (Data Understanding)",
    details: "Agimos como detetives, coletando e explorando os dados para identificar qualidade, disponibilidade e padrões iniciais. Respondemos: 'Os dados são suficientes?'.",
    color: "gold"
  },
  {
    id: 2,
    icon: Filter,
    number: "3",
    shortTitle: "Preparação dos Dados",
    fullTitle: "3. Preparação dos Dados (Data Preparation)",
    details: "Frequentemente a etapa mais demorada (90% do trabalho). Aqui limpamos, formatamos, enriquecemos e transformamos os dados brutos (features) para o modelo consumir.",
    color: "primary"
  },
  {
    id: 3,
    icon: BrainCircuit,
    number: "4",
    shortTitle: "Modelagem",
    fullTitle: "4. Modelagem (Modeling)",
    details: "Aqui o Machine Learning acontece. Selecionamos, treinamos e ajustamos (fine-tuning) algoritmos para encontrar o que melhor responde ao problema de negócio.",
    color: "wine"
  },
  {
    id: 4,
    icon: CheckCheck,
    number: "5",
    shortTitle: "Avaliação",
    fullTitle: "5. Avaliação (Evaluation)",
    details: "Um modelo com 99% de acurácia pode ser inútil se não resolver o problema de negócio. Avaliamos o modelo contra as métricas da Etapa 1 e decidimos se ele está pronto.",
    color: "gold"
  },
  {
    id: 5,
    icon: Rocket,
    number: "6",
    shortTitle: "Implantação",
    fullTitle: "6. Implantação (Deployment)",
    details: "O modelo só gera valor em produção. Esta etapa envolve colocar o modelo 'no ar' (como uma API) para consumo. O ciclo não termina aqui, pois iniciamos o monitoramento.",
    color: "wine"
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
    <section
      ref={sectionRef}
      id="metodologia"
      className="py-20 bg-gradient-to-b from-background to-background/50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Título Principal da Seção */}
          <div className={cn(
            "text-center space-y-4 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-gold to-wine bg-clip-text text-transparent">
              Metodologia CRISP-DM
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              O padrão da indústria para projetos de Ciência de Dados
            </p>
          </div>

          {/* Explicação: Por que não Agile? */}
          <div className={cn(
            "bg-muted/30 rounded-xl p-8 border border-border/50 transition-all duration-1000 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Por que Ciência de Dados não usa Agile?</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Projetos de Ciência de Dados são <span className="font-semibold text-foreground">exploratórios</span> e <span className="font-semibold text-foreground">experimentais</span>. 
                  Você não sabe se os dados vão "funcionar" ou se o modelo será bom o suficiente até tentar. 
                  Por isso, usamos <span className="font-semibold text-primary">CRISP-DM</span> (Cross-Industry Standard Process for Data Mining), 
                  uma metodologia <span className="font-semibold text-foreground">iterativa</span> e <span className="font-semibold text-foreground">adaptável</span>, 
                  onde cada etapa pode exigir retornar à anterior (ex: modelo ruim → voltar aos dados).
                </p>
              </div>
            </div>
          </div>

          {/* Imagem do Ciclo CRISP-DM */}
          <div className={cn(
            "flex justify-center transition-all duration-1000 delay-300",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <div className="relative max-w-2xl w-full">
              <img 
                src="/src/assets/crisp-dm-cycle.png" 
                alt="Diagrama do Ciclo CRISP-DM mostrando as 6 etapas: Business Understanding, Data Understanding, Data Preparation, Modeling, Evaluation e Deployment, conectadas em um fluxo circular iterativo" 
                className="w-full h-auto rounded-lg shadow-xl border border-border/30"
              />
            </div>
          </div>

          {/* Descrição das 6 Etapas do CRISP-DM */}
          <div 
            className={cn(
              "transition-all duration-1000 delay-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              As 6 Etapas do Ciclo CRISP-DM
            </h3>

            {/* Fluxo Linear do Ciclo CRISP-DM */}
            <div className="relative w-full max-w-4xl mx-auto mb-16">
              <div className="relative">
                {crispSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = activeCrispStep === index;
                  
                  return (
                    <div key={step.id} className="relative">
                      {/* Card da Etapa - Clicável e Expansível */}
                      <div
                        className={cn(
                          "rounded-xl border-2 cursor-pointer transition-all duration-300 mb-4 overflow-hidden",
                          isActive 
                            ? "shadow-lg" 
                            : "hover:shadow-md"
                        )}
                        style={{
                          borderColor: isActive 
                            ? `hsl(var(--${step.color}))` 
                            : `hsl(var(--border))`,
                          backgroundColor: isActive 
                            ? `hsl(var(--${step.color}) / 0.05)` 
                            : `hsl(var(--background))`
                        }}
                        onClick={() => setActiveCrispStep(isActive ? -1 : index)}
                      >
                        {/* Header do Card - Sempre Visível */}
                        <div className="p-6">
                          <div className="flex items-center gap-4">
                            {/* Número e Ícone */}
                            <div 
                              className="flex items-center justify-center w-16 h-16 rounded-xl shrink-0 transition-all duration-300"
                              style={{
                                backgroundColor: `hsl(var(--${step.color}) / 0.2)`
                              }}
                            >
                              <div className="relative">
                                <span 
                                  className="absolute -top-1 -right-1 text-xs font-bold"
                                  style={{ color: `hsl(var(--${step.color}))` }}
                                >
                                  {step.number}
                                </span>
                                <Icon 
                                  className="w-8 h-8" 
                                  style={{ color: `hsl(var(--${step.color}))` }}
                                />
                              </div>
                            </div>
                            
                            {/* Título */}
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-1">{step.shortTitle}</h4>
                              <p className="text-sm text-muted-foreground">
                                {isActive ? "Clique para recolher" : "Clique para expandir"}
                              </p>
                            </div>

                            {/* Indicador Ativo */}
                            <div 
                              className={cn(
                                "w-3 h-3 rounded-full transition-all duration-300",
                                isActive ? "animate-pulse" : "opacity-30"
                              )}
                              style={{ backgroundColor: `hsl(var(--${step.color}))` }}
                            />
                          </div>
                        </div>

                        {/* Conteúdo Expansível */}
                        <div 
                          className={cn(
                            "overflow-hidden transition-all duration-300",
                            isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          <div className="px-6 pb-6 pt-0">
                            <div 
                              className="p-4 rounded-lg"
                              style={{
                                backgroundColor: `hsl(var(--${step.color}) / 0.1)`
                              }}
                            >
                              <p className="text-lg text-foreground leading-relaxed">
                                {step.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Seta para a próxima etapa */}
                      {index < crispSteps.length - 1 && (
                        <div className="flex justify-center my-2">
                          <ArrowDown 
                            className={cn(
                              "w-6 h-6 transition-all duration-300",
                              isActive ? "scale-125" : ""
                            )}
                            style={{ 
                              color: isActive ? `hsl(var(--${step.color}))` : `hsl(var(--muted-foreground))` 
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Methodology;
