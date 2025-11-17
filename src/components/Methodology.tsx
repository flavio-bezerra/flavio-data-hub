import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, Database, Filter, BrainCircuit, CheckCheck, Rocket, ArrowDown, ArrowUp } from "lucide-react";
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
              Metodologias Ágeis (como o Scrum) são excelentes para <strong>Desenvolvimento de Software</strong>, onde o objetivo final é claro (ex: "construir um botão de login"). O risco é o <em>tempo</em>.
            </p>
            <p>
              <strong>Data Science é Pesquisa & Descoberta.</strong> Não sabemos a resposta (ou se ela existe nos dados) quando começamos. O risco é a <em>viabilidade</em>.
            </p>
            <p className="text-foreground font-semibold">
              Por isso, usamos o <span className="text-gold font-bold">CRISP-DM</span>: um processo padrão da indústria focado em mitigar o risco da descoberta. Ele é iterativo como o Agile, mas força o foco total no entendimento do negócio e dos dados <em>antes</em> de construir a solução.
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

          {/* Fluxo Linear do Ciclo CRISP-DM */}
          <div className="relative w-full max-w-4xl mx-auto mb-16">
            {/* Grid de Etapas */}
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
                          : "hover:scale-[1.01]"
                      )}
                      style={{
                        backgroundColor: isActive ? `hsl(var(--${step.color}) / 0.15)` : `hsl(var(--card) / 0.5)`,
                        borderColor: isActive ? `hsl(var(--${step.color}))` : `hsl(var(--border) / 0.5)`,
                        boxShadow: isActive ? `0 10px 30px -10px hsl(var(--${step.color}) / 0.3)` : undefined
                      }}
                    >
                      {/* Header - Sempre Visível */}
                      <div 
                        onClick={() => setActiveCrispStep(isActive ? -1 : index)}
                        className="p-6"
                      >
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

                    {/* Seta de retorno da Avaliação (5) para Dados (2) */}
                    {index === 4 && (
                      <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                              style={{
                                backgroundColor: `hsl(var(--gold) / 0.2)`,
                                color: `hsl(var(--gold))`
                              }}
                            >
                              Iteração
                            </div>
                          </div>
                          <ArrowUp 
                            className="w-6 h-6 animate-bounce" 
                            style={{ color: `hsl(var(--gold))` }}
                          />
                          <div 
                            className="w-0.5 h-[380px]"
                            style={{
                              background: `linear-gradient(to bottom, hsl(var(--gold)), transparent)`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Methodology;
