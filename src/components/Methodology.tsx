import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, Database, Filter, BrainCircuit, CheckCheck, Rocket } from "lucide-react";
import crispDmImage from "@/assets/crisp-dm-cycle.png";

// Dados para as 6 etapas do CRISP-DM
const crispSteps = [
  {
    icon: Briefcase,
    title: "1. Entendimento do Negócio (Business Understanding)",
    details: "Esta é a etapa mais crucial. Antes de escrever qualquer código, focamos em definir o problema de negócio. Qual pergunta estamos tentando responder? Qual métrica de sucesso (KPI) estamos tentando mover? Uma definição clara do problema evita desperdício de tempo e garante que o resultado final gere valor real."
  },
  {
    icon: Database,
    title: "2. Entendimento dos Dados (Data Understanding)",
    details: "Aqui, agimos como detetives. Fazemos uma coleta inicial de dados e realizamos uma análise exploratória para identificar a qualidade, a disponibilidade e os padrões iniciais. Respondemos perguntas como: 'Os dados que temos são suficientes para resolver o problema?'."
  },
  {
    icon: Filter,
    title: "3. Preparação dos Dados (Data Preparation)",
    details: "Frequentemente a etapa mais demorada (90% do trabalho). Aqui limpamos, formatamos, enriquecemos e transformamos os dados brutos em um formato limpo e estruturado (features) que o modelo de Machine Learning possa consumir."
  },
  {
    icon: BrainCircuit,
    title: "4. Modelagem (Modeling)",
    details: "Esta é a etapa onde o Machine Learning acontece. Selecionamos, treinamos e ajustamos (fine-tuning) diversos algoritmos para encontrar o que melhor aprende os padrões nos dados e responde ao problema de negócio definido na Etapa 1."
  },
  {
    icon: CheckCheck,
    title: "5. Avaliação (Evaluation)",
    details: "Um modelo com 99% de acurácia pode ser inútil se não resolver o problema de negócio. Nesta fase, avaliamos o desempenho do modelo não apenas tecnicamente, mas contra as métricas de sucesso definidas na Etapa 1. Decidimos se o modelo está pronto ou se precisamos voltar para a prancheta."
  },
  {
    icon: Rocket,
    title: "6. Implantação (Deployment)",
    details: "O modelo só gera valor quando está em produção. Esta etapa envolve colocar o modelo 'no ar' (geralmente como uma API) para que outros sistemas possam consumi-lo, ou entregar um dashboard final. O ciclo não termina aqui, pois iniciamos o monitoramento contínuo."
  }
];

const Methodology = () => {
  const [isVisible, setIsVisible] = useState(false);
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

          {/* Imagem do Ciclo */}
          <div className="flex justify-center mb-8 px-4">
            <img 
              src={crispDmImage} 
              alt="Ciclo CRISP-DM associada a Metodologia Agile" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Acordeão Interativo */}
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {crispSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AccordionItem value={`item-${index}`} key={index} className="border-border">
                  <AccordionTrigger className="p-4 hover:no-underline rounded-lg hover:bg-card-foreground/5 data-[state=open]:bg-card-foreground/10">
                    <div className="flex items-center gap-4 w-full pr-4 text-left">
                      <div className="p-3 rounded-lg bg-card-foreground/10 text-primary">
                        <Icon className="w-6 h-6 shrink-0" />
                      </div>
                      <h4 className="flex-1 font-bold text-base md:text-lg text-foreground">{step.title}</h4>
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
