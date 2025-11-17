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
    value: 1
  },
  {
    id: 1,
    icon: Database,
    shortTitle: "2. Dados",
    fullTitle: "2. Entendimento dos Dados (Data Understanding)",
    details: "Agimos como detetives, coletando e explorando os dados para identificar qualidade, disponibilidade e padrões iniciais. Respondemos: 'Os dados são suficientes?'.",
    color: "hsl(var(--gold))",
    value: 1
  },
  {
    id: 2,
    icon: Filter,
    shortTitle: "3. Preparação",
    fullTitle: "3. Preparação dos Dados (Data Preparation)",
    details: "Frequentemente a etapa mais demorada (90% do trabalho). Aqui limpamos, formatamos, enriquecemos e transformamos os dados brutos (features) para o modelo consumir.",
    color: "hsl(var(--primary))",
    value: 1
  },
  {
    id: 3,
    icon: BrainCircuit,
    shortTitle: "4. Modelagem",
    fullTitle: "4. Modelagem (Modeling)",
    details: "Aqui o Machine Learning acontece. Selecionamos, treinamos e ajustamos (fine-tuning) algoritmos para encontrar o que melhor responde ao problema de negócio.",
    color: "hsl(var(--wine))",
    value: 1
  },
  {
    id: 4,
    icon: CheckCheck,
    shortTitle: "5. Avaliação",
    fullTitle: "5. Avaliação (Evaluation)",
    details: "Um modelo com 99% de acurácia pode ser inútil se não resolver o problema de negócio. Avaliamos o modelo contra as métricas da Etapa 1 e decidimos se ele está pronto.",
    color: "hsl(var(--gold))",
    value: 1
  },
  {
    id: 5,
    icon: Rocket,
    shortTitle: "6. Implantação",
    fullTitle: "6. Implantação (Deployment)",
    details: "O modelo só gera valor em produção. Esta etapa envolve colocar o modelo 'no ar' (como uma API) para consumo. O ciclo não termina aqui, pois iniciamos o monitoramento.",
    color: "hsl(var(--wine))",
    value: 1
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

          {/* Visual Interativo do Ciclo CRISP-DM (Gráfico de Rosca) */}
          <div className="w-full h-96 md:h-[450px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip content={({ payload }) => {
                  if (payload && payload.length) {
                    return (
                      <div className="bg-popover p-2 rounded border border-border shadow-lg">
                        <p className="text-popover-foreground font-bold">{payload[0].payload.fullTitle}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Pie
                  data={crispSteps}
                  dataKey="value"
                  nameKey="shortTitle"
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  cornerRadius={5}
                  paddingAngle={5}
                  onClick={(_, index) => setActiveCrispStep(index)}
                >
                  {crispSteps.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeCrispStep === index ? 1 : 0.4}
                      className="cursor-pointer transition-opacity"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
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
