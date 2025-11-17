import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, AlertCircle, TrendingUp, Lightbulb, Brain, ArrowLeft } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip as RechartsTooltip, Scatter } from "recharts";


const WhatIsDataScience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [diagramVisible, setDiagramVisible] = useState(false);
  const [circlesVisible, setCirclesVisible] = useState<number[]>([]);
  const [columnsVisible, setColumnsVisible] = useState<number[]>([]);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const [activeClassic, setActiveClassic] = useState<string | undefined>("descritiva");
  const [activeGenAI, setActiveGenAI] = useState<string | undefined>("prompt");
  const sectionRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const diagramObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDiagramVisible(true);
          // Animate circles one by one
          [0, 1, 2].forEach((index) => {
            setTimeout(() => {
              setCirclesVisible((prev) => [...prev, index]);
            }, index * 300);
          });
          // Animate columns after circles
          [0, 1, 2].forEach((index) => {
            setTimeout(() => {
              setColumnsVisible((prev) => [...prev, index]);
            }, 1200 + index * 200);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (diagramRef.current) {
      diagramObserver.observe(diagramRef.current);
    }

    return () => {
      if (diagramRef.current) {
        diagramObserver.unobserve(diagramRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Definition */}
        <div
          className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            O que é Ciência de Dados?
          </h2>
          <p className="text-xl text-muted-foreground text-center leading-relaxed">
            Em 2012, um artigo da <span className="font-semibold">Harvard Business Review</span> definiu o Cientista de Dados como{" "}
            <span className="text-primary font-semibold">"O Trabalho Mais Sexy do Século XXI"</span>. 
            Essa definição marcou um ponto de virada: ela posicionou a análise de dados como um pilar central da estratégia de negócio.
          </p>
          <p className="text-xl text-muted-foreground text-center leading-relaxed mt-6">
            O modelo conceitual que melhor define essa disciplina é um <span className="font-semibold">Diagrama de Venn</span> que 
            a posiciona na interseção de três pilares fundamentais:
          </p>
        </div>

        {/* Three Pillars Section */}
        <div ref={diagramRef} className="max-w-6xl mx-auto mb-16">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              diagramVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-12">
              Os Três Pilares da Ciência de Dados
            </h3>

            {/* Venn Diagram Container with Label */}
            <div className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[450px] mb-16 flex items-center justify-center">
              {/* Diagram */}
              <div className="relative w-full max-w-2xl h-[350px] md:h-[450px] flex items-center justify-center">
                {/* SVG Pattern for Hatching */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }}>
                  <defs>
                    <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="2" opacity="0.6" />
                    </pattern>
                  </defs>
                  {/* Central intersection circle with hatching */}
                  <circle 
                    cx="50%" 
                    cy="56%" 
                    r="20" 
                    className={`transition-all duration-300 cursor-pointer pointer-events-auto md:r-[30px] ${
                      circlesVisible.length >= 3 ? "opacity-100" : "opacity-0"
                    } ${hoveredPillar === 3 ? "opacity-100" : ""}`}
                    fill="url(#hatch)"
                    onMouseEnter={() => setHoveredPillar(3)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  />
                </svg>

                {/* Programming Circle - Top */}
                <div 
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 md:w-72 md:h-72 rounded-full bg-primary/30 border-4 border-primary flex items-start justify-center pt-4 md:pt-8 transition-all duration-300 cursor-pointer z-10 ${
                    circlesVisible.includes(0) ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  } ${hoveredPillar !== null && hoveredPillar !== 0 ? "opacity-30" : "hover:scale-105"}`}
                  onMouseEnter={() => setHoveredPillar(0)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <span className="text-primary font-bold text-base md:text-xl pointer-events-none">Programação</span>
                </div>
                
                {/* Statistics Circle - Bottom Left */}
                <div 
                  className={`absolute bottom-0 left-[5%] md:left-[15%] w-48 h-48 md:w-72 md:h-72 rounded-full bg-gold/30 border-4 border-gold flex items-end justify-start pb-4 md:pb-8 pl-6 md:pl-12 transition-all duration-300 cursor-pointer z-10 ${
                    circlesVisible.includes(1) ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  } ${hoveredPillar !== null && hoveredPillar !== 1 ? "opacity-30" : "hover:scale-105"}`}
                  onMouseEnter={() => setHoveredPillar(1)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <span className="text-gold font-bold text-base md:text-xl pointer-events-none">Estatística</span>
                </div>
                
                {/* Business Circle - Bottom Right */}
                <div 
                  className={`absolute bottom-0 right-[5%] md:right-[15%] w-48 h-48 md:w-72 md:h-72 rounded-full bg-wine/30 border-4 border-wine flex items-end justify-end pb-4 md:pb-8 pr-6 md:pr-12 transition-all duration-300 cursor-pointer z-10 ${
                    circlesVisible.includes(2) ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  } ${hoveredPillar !== null && hoveredPillar !== 2 ? "opacity-30" : "hover:scale-105"}`}
                  onMouseEnter={() => setHoveredPillar(2)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <span className="text-wine font-bold text-base md:text-xl pointer-events-none">Negócio</span>
                </div>
              </div>

              {/* Label with Arrow - Positioned to the right */}
              <div className={`absolute right-0 md:right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-4 transition-all duration-700 delay-[1000ms] ${
                circlesVisible.length >= 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}>
                <ArrowLeft className="w-8 h-8 md:w-12 md:h-12 text-foreground" strokeWidth={3} />
                <div className="text-left">
                  <span className="font-bold text-sm md:text-xl text-foreground block">Ciência de Dados</span>
                  <span className="font-bold text-xs md:text-lg text-muted-foreground">(Valor)</span>
                </div>
              </div>
            </div>

            {/* Three Columns Explanation */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Programming */}
              <div className={`text-left transition-all duration-300 ${
                columnsVisible.includes(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${hoveredPillar !== null && hoveredPillar !== 0 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 0 ? "scale-105 ring-2 ring-primary rounded-lg p-4 -m-4 bg-primary/5" : ""}`}>
                <h4 className="text-2xl font-bold mb-4 text-primary">
                  1. Programação<br />(O Motor)
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Também chamado de 'Hacking Skills', é o motor que nos permite coletar, processar e analisar bilhões 
                  de informações em alta velocidade, tornando a análise em larga escala viável.
                </p>
              </div>

              {/* Statistics */}
              <div className={`text-left transition-all duration-300 ${
                columnsVisible.includes(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${hoveredPillar !== null && hoveredPillar !== 1 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 1 ? "scale-105 ring-2 ring-gold rounded-lg p-4 -m-4 bg-gold/5" : ""}`}>
                <h4 className="text-2xl font-bold mb-4 text-gold">
                  2. Estatística<br />(A Lógica)
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Este pilar é a lógica que valida a análise. Fornece os métodos rigorosos para encontrar padrões, 
                  testar hipóteses e diferenciar um sinal verdadeiro de um ruído aleatório.
                </p>
              </div>

              {/* Business */}
              <div className={`text-left transition-all duration-300 ${
                columnsVisible.includes(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${hoveredPillar !== null && hoveredPillar !== 2 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 2 ? "scale-105 ring-2 ring-wine rounded-lg p-4 -m-4 bg-wine/5" : ""}`}>
                <h4 className="text-2xl font-bold mb-4 text-wine">
                  3. Negócio<br />(O Propósito)
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  A 'Expertise Substantiva' é o que dá propósito a tudo. É o entendimento profundo dos objetivos 
                  estratégicos da empresa e quais problemas realmente importam.
                </p>
              </div>
            </div>

            {/* Conclusion */}
            <div className={`max-w-3xl mx-auto text-center transition-all duration-300 ${
              hoveredPillar === 3 ? "scale-105 ring-2 ring-foreground/20 rounded-lg p-6 -m-6 bg-foreground/5" : ""
            } ${hoveredPillar !== null && hoveredPillar !== 3 ? "opacity-30" : ""}`}>
              <h4 className="text-2xl font-bold mb-4">
                A Interseção: Onde a Estratégia Nasce
              </h4>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "Meu trabalho como Especialista de Dados reside precisamente onde esses três pilares se encontram. 
                O valor é gerado ao aplicar a lógica estatística e o motor computacional para resolver os problemas corretos, 
                transformando dados brutos em resultados mensuráveis."
              </p>
            </div>
          </div>
        </div>

        {/* Approach - New Maturity Sections */}
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Da Pergunta ao Resultado
            </h3>
            <p className="text-xl text-muted-foreground mb-16">
              Meu trabalho é guiar as decisões de negócio através de jornadas de maturidade analítica:
            </p>

            <Tabs defaultValue="classic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-card-foreground/5">
                <TabsTrigger value="classic">Maturidade (ML Clássico)</TabsTrigger>
                <TabsTrigger value="gen-ai">Maturidade (IA Generativa)</TabsTrigger>
              </TabsList>

              {/* Tab Content 1: ML Clássico */}
              <TabsContent value="classic">
              
              {(() => {
                const classicMLLevels = [
                  { 
                    id: "descritiva", 
                    icon: Search, 
                    title: "1. Descrevendo (O que aconteceu?)", 
                    description: "Visão consolidada do histórico.", 
                    details: "A Análise Descritiva é a base. Ela usa dados históricos para criar dashboards e relatórios que mostram métricas-chave (KPIs) e tendências passadas.", 
                    value: 1, 
                    complexity: 1, 
                    color: "hsl(var(--primary))" 
                  },
                  { 
                    id: "diagnostica", 
                    icon: AlertCircle, 
                    title: "2. Diagnosticando (Por que aconteceu?)", 
                    description: "Investigação para encontrar a causa raiz.", 
                    details: "A Análise Diagnóstica vai além do 'o quê' e pergunta 'por quê'. Ela usa técnicas de drill-down e correlação para identificar os fatores que causaram um determinado resultado.", 
                    value: 2, 
                    complexity: 2, 
                    color: "#a855f7" 
                  },
                  { 
                    id: "preditiva", 
                    icon: TrendingUp, 
                    title: "3. Prevendo (O que vai acontecer?)", 
                    description: "Uso de Machine Learning para prever o futuro.", 
                    details: "A Análise Preditiva usa os dados do passado para criar modelos que estimam o futuro. Essencial para prever demanda, estimar o risco de churn de clientes ou identificar tendências de vendas.", 
                    value: 3, 
                    complexity: 3, 
                    color: "hsl(var(--primary))" 
                  },
                  { 
                    id: "prescritiva", 
                    icon: Lightbulb, 
                    title: "4. Prescrevendo (O que devemos fazer?)", 
                    description: "Modelos de otimização para recomendar ações.", 
                    details: "A Análise Prescritiva é o nível mais alto. Ela não apenas prevê o futuro, mas recomenda as melhores ações e simula o impacto de cada decisão, ajudando a otimizar estratégias.", 
                    value: 4, 
                    complexity: 4, 
                    color: "hsl(var(--gold))" 
                  }
                ];

                return (
                  <>
                    {/* Chart 1: Classic ML */}
                    <div className="mb-8 bg-card rounded-lg p-6 border">
                      <h4 className="text-lg font-semibold mb-4 text-left">Valor vs. Complexidade</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <XAxis 
                            type="number" 
                            dataKey="complexity" 
                            name="Complexidade" 
                            domain={[0, 5]}
                            ticks={[1, 2, 3, 4]}
                            label={{ value: 'Complexidade', position: 'insideBottom', offset: -10 }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="value" 
                            name="Valor" 
                            domain={[0, 5]}
                            ticks={[1, 2, 3, 4]}
                            label={{ value: 'Valor', angle: -90, position: 'insideLeft' }}
                          />
                          <RechartsTooltip 
                            cursor={false}
                            content={({ payload }) => {
                              if (payload && payload.length > 0) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-card border rounded-lg p-3 shadow-lg">
                                    <p className="font-semibold text-foreground">{data.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Scatter 
                            data={classicMLLevels}
                            shape={(props: any) => {
                              const { cx, cy, payload } = props;
                              const isActive = activeClassic === payload.id;
                              const r = isActive ? 36 : 18; // 30% do anterior (120 e 60)
                              return (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={r}
                                  fill={payload.color}
                                  opacity={isActive ? 1 : 0.5}
                                  className="cursor-pointer transition-all duration-300"
                                  onClick={() => setActiveClassic(payload.id)}
                                />
                              );
                            }}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Accordion 1: Classic ML */}
                    <Accordion 
                      type="single" 
                      collapsible 
                      value={activeClassic} 
                      onValueChange={setActiveClassic} 
                      className="w-full"
                    >
                      {classicMLLevels.map((item) => {
                        const Icon = item.icon;
                        return (
                          <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="p-4 hover:no-underline rounded-lg hover:bg-card-foreground/5 data-[state=open]:bg-card-foreground/10">
                              <div className="flex items-center gap-4 w-full pr-4 text-left">
                                <div className="p-3 rounded-lg bg-card-foreground/10" style={{ color: item.color }}>
                                  <Icon className="w-6 h-6 shrink-0" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-base text-foreground">{item.title}</h4>
                                  <p className="text-sm text-muted-foreground font-normal mt-1">{item.description}</p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-16 pr-4 pt-2">
                                <p className="text-muted-foreground leading-relaxed">{item.details}</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </>
                );
              })()}
              </TabsContent>

              {/* Tab Content 2: IA Generativa */}
              <TabsContent value="gen-ai">
              
              {(() => {
                const genAILevels = [
                  { 
                    id: "prompt", 
                    icon: Brain, 
                    title: "1. Engenharia de Prompt", 
                    description: "Otimização de comandos para LLMs.", 
                    details: "Esta é a habilidade fundamental de construir instruções claras e contextuais para que os Modelos de Linguagem (LLMs) executem tarefas específicas com precisão.", 
                    value: 1, 
                    complexity: 1, 
                    color: "hsl(var(--wine))" 
                  },
                  { 
                    id: "rag", 
                    icon: Brain, 
                    title: "2. RAG (Busca Aumentada)", 
                    description: "Conectando LLMs a dados privados.", 
                    details: "O RAG (Retrieval-Augmented Generation) permite que a IA responda perguntas usando como base seus documentos internos, garantindo respostas seguras e precisas baseadas em fontes de dados privadas.", 
                    value: 2, 
                    complexity: 2, 
                    color: "hsl(var(--wine))" 
                  },
                  { 
                    id: "finetuning", 
                    icon: Brain, 
                    title: "3. Fine-tuning (Especialização)", 
                    description: "Treinando o modelo em tarefas específicas.", 
                    details: "O Fine-tuning ajusta um modelo de IA pré-treinado para uma tarefa ou estilo de linguagem muito específico, aumentando drasticamente sua performance e especialização.", 
                    value: 3, 
                    complexity: 3, 
                    color: "hsl(var(--wine))" 
                  },
                  { 
                    id: "agents", 
                    icon: Brain, 
                    title: "4. Multi-Agentes (Autonomia)", 
                    description: "IAs que planejam e executam tarefas.", 
                    details: "Este é o nível mais avançado, onde múltiplos 'Agentes' de IA colaboram, planejam e executam sequências de tarefas complexas de forma autônoma para atingir um objetivo.", 
                    value: 4, 
                    complexity: 4, 
                    color: "hsl(var(--wine))" 
                  }
                ];

                return (
                  <>
                    {/* Chart 2: GenAI */}
                    <div className="mb-8 bg-card rounded-lg p-6 border">
                      <h4 className="text-lg font-semibold mb-4 text-left">Valor vs. Complexidade</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <XAxis 
                            type="number" 
                            dataKey="complexity" 
                            name="Complexidade" 
                            domain={[0, 5]}
                            ticks={[1, 2, 3, 4]}
                            label={{ value: 'Complexidade', position: 'insideBottom', offset: -10 }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="value" 
                            name="Valor" 
                            domain={[0, 5]}
                            ticks={[1, 2, 3, 4]}
                            label={{ value: 'Valor', angle: -90, position: 'insideLeft' }}
                          />
                          <RechartsTooltip 
                            cursor={false}
                            content={({ payload }) => {
                              if (payload && payload.length > 0) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-card border rounded-lg p-3 shadow-lg">
                                    <p className="font-semibold text-foreground">{data.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Scatter 
                            data={genAILevels}
                            shape={(props: any) => {
                              const { cx, cy, payload } = props;
                              const isActive = activeGenAI === payload.id;
                              const r = isActive ? 36 : 18; // 30% do anterior (120 e 60)
                              return (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={r}
                                  fill={payload.color}
                                  opacity={isActive ? 1 : 0.5}
                                  className="cursor-pointer transition-all duration-300"
                                  onClick={() => setActiveGenAI(payload.id)}
                                />
                              );
                            }}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Accordion 2: GenAI */}
                    <Accordion 
                      type="single" 
                      collapsible 
                      value={activeGenAI} 
                      onValueChange={setActiveGenAI} 
                      className="w-full"
                    >
                      {genAILevels.map((item) => {
                        const Icon = item.icon;
                        return (
                          <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="p-4 hover:no-underline rounded-lg hover:bg-card-foreground/5 data-[state=open]:bg-card-foreground/10">
                              <div className="flex items-center gap-4 w-full pr-4 text-left">
                                <div className="p-3 rounded-lg bg-card-foreground/10" style={{ color: item.color }}>
                                  <Icon className="w-6 h-6 shrink-0" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-base text-foreground">{item.title}</h4>
                                  <p className="text-sm text-muted-foreground font-normal mt-1">{item.description}</p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-16 pr-4 pt-2">
                                <p className="text-muted-foreground leading-relaxed">{item.details}</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </>
                );
              })()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsDataScience;
