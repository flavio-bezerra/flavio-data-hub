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
    <section ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-wine rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Definition */}
        <div
          className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center gradient-text leading-tight pb-2 ${isVisible ? 'animate-fade-in' : ''}`}>
            O que é Ciência de Dados?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center leading-relaxed">
            Em 2012, um artigo da <span className="font-semibold">Harvard Business Review</span> definiu o Cientista de Dados como{" "}
            <span className="text-primary font-semibold">"O Trabalho Mais Sexy do Século XXI"</span>. 
            Essa definição marcou um ponto de virada: ela posicionou a análise de dados como um pilar central da estratégia de negócio.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center leading-relaxed mt-4 sm:mt-6">
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
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 px-4">
              Os Três Pilares da Ciência de Dados
            </h3>

            {/* Venn Diagram Container with Label */}
            <div className="relative w-full max-w-4xl mx-auto mb-16 flex items-center justify-center px-2 sm:px-4">
              {/* Diagram */}
              <div className="relative w-full max-w-2xl flex items-center justify-center" style={{ minHeight: '250px', height: 'clamp(250px, 45vw, 450px)' }}>
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
                    r="clamp(15, 5vw, 30)" 
                    fill="url(#hatch)"
                    className={`transition-all duration-300 cursor-pointer pointer-events-auto ${
                      circlesVisible.length >= 3 ? "opacity-100" : "opacity-0"
                    } ${hoveredPillar === 3 ? "opacity-100" : ""}`}
                    onMouseEnter={() => setHoveredPillar(3)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  />
                </svg>

                {/* Programming Circle - Top */}
                <div 
                  className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-primary/30 border-2 sm:border-3 md:border-4 border-primary flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${
                    circlesVisible.includes(0) ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  } ${hoveredPillar !== null && hoveredPillar !== 0 ? "opacity-30" : "hover:scale-105"}`}
                  style={{ 
                    width: 'clamp(140px, 37vw, 288px)',
                    height: 'clamp(140px, 37vw, 288px)'
                  }}
                  onMouseEnter={() => setHoveredPillar(0)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <span className="text-primary font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl pointer-events-none">Programação</span>
                </div>
                
                {/* Statistics Circle - Bottom Left */}
                <div 
                  className={`absolute bottom-0 rounded-full bg-gold/30 border-2 sm:border-3 md:border-4 border-gold flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${
                    circlesVisible.includes(1) ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  } ${hoveredPillar !== null && hoveredPillar !== 1 ? "opacity-30" : "hover:scale-105"}`}
                  style={{ 
                    width: 'clamp(140px, 37vw, 288px)',
                    height: 'clamp(140px, 37vw, 288px)',
                    left: 'clamp(2%, 10%, 15%)'
                  }}
                  onMouseEnter={() => setHoveredPillar(1)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <span className="text-gold font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl pointer-events-none">Estatística</span>
                </div>
                
                {/* Business Circle - Bottom Right */}
                <div 
                  className={`absolute bottom-0 rounded-full bg-wine/30 border-2 sm:border-3 md:border-4 border-wine flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${
                    circlesVisible.includes(2) ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  } ${hoveredPillar !== null && hoveredPillar !== 2 ? "opacity-30" : "hover:scale-105"}`}
                  style={{ 
                    width: 'clamp(140px, 37vw, 288px)',
                    height: 'clamp(140px, 37vw, 288px)',
                    right: 'clamp(2%, 10%, 15%)'
                  }}
                  onMouseEnter={() => setHoveredPillar(2)}
                  onMouseLeave={() => setHoveredPillar(null)}
                >
                  <span className="text-wine font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl pointer-events-none">Negócio</span>
                </div>
              </div>
            </div>

            {/* Three Columns Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 px-4">
              {/* Programming */}
              <div className={`text-left transition-all duration-300 p-4 rounded-lg ${
                columnsVisible.includes(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${hoveredPillar !== null && hoveredPillar !== 0 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 0 ? "scale-105 ring-2 ring-primary bg-primary/5" : "bg-card/30"}`}>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary">
                  1. Programação<br />(O Motor)
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Também chamado de 'Hacking Skills', é o motor que nos permite coletar, processar e analisar bilhões 
                  de informações em alta velocidade, tornando a análise em larga escala viável.
                </p>
              </div>

              {/* Statistics */}
              <div className={`text-left transition-all duration-300 p-4 rounded-lg ${
                columnsVisible.includes(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${hoveredPillar !== null && hoveredPillar !== 1 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 1 ? "scale-105 ring-2 ring-gold bg-gold/5" : "bg-card/30"}`}>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gold">
                  2. Estatística<br />(A Lógica)
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Este pilar é a lógica que valida a análise. Fornece os métodos rigorosos para encontrar padrões, 
                  testar hipóteses e diferenciar um sinal verdadeiro de um ruído aleatório.
                </p>
              </div>

              {/* Business */}
              <div className={`text-left transition-all duration-300 p-4 rounded-lg ${
                columnsVisible.includes(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${hoveredPillar !== null && hoveredPillar !== 2 ? "opacity-30 scale-95" : ""} ${hoveredPillar === 2 ? "scale-105 ring-2 ring-wine bg-wine/5" : "bg-card/30"}`}>
                <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-wine">
                  3. Negócio<br />(O Propósito)
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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
               4. Interseção (Onde a Estratégia Nasce)
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
                    details: "A Análise Descritiva é o primeiro nível e se concentra em responder à pergunta: \"O que aconteceu?\". Seu principal objetivo é consolidar e resumir dados históricos para fornecer uma visão clara do passado. Isso é comumente alcançado através de relatórios, dashboards e visualizações de dados que mostram métricas e KPIs (Indicadores-Chave de Performance), permitindo que a organização tenha uma compreensão básica de seu desempenho, como o total de vendas do último trimestre.", 
                    value: 1, 
                    complexity: 1, 
                    color: "hsl(var(--primary))" 
                  },
                  { 
                    id: "diagnostica", 
                    icon: AlertCircle, 
                    title: "2. Diagnosticando (Por que aconteceu?)", 
                    description: "Investigação para encontrar a causa raiz.", 
                    details: "Subindo um nível, a Análise Diagnóstica busca entender \"Por que aconteceu?\". Em vez de apenas observar os dados, este estágio envolve uma investigação mais profunda para descobrir as causas raízes por trás de um evento ou tendência. Utilizando técnicas como drill-down (aprofundamento nos dados) e análise de correlação, ela tenta explicar por que, por exemplo, as vendas caíram em uma determinada região, talvez identificando uma nova campanha de um concorrente ou um problema logístico.", 
                    value: 2, 
                    complexity: 2, 
                    color: "#a855f7" 
                  },
                  { 
                    id: "preditiva", 
                    icon: TrendingUp, 
                    title: "3. Prevendo (O que vai acontecer?)", 
                    description: "Uso de Machine Learning para prever o futuro.", 
                    details: "A Análise Preditiva muda o foco do passado para o futuro, respondendo à pergunta: \"O que vai acontecer?\". Neste nível, são aplicados modelos estatísticos e de Machine Learning sobre dados históricos para prever tendências e comportamentos futuros. Exemplos clássicos incluem a previsão de demanda de produtos (forecasting), a identificação de clientes com alto risco de cancelamento (churn) ou a estimativa da probabilidade de fraude em uma transação.", 
                    value: 3, 
                    complexity: 3, 
                    color: "hsl(var(--primary))" 
                  },
                  { 
                    id: "prescritiva", 
                    icon: Lightbulb, 
                    title: "4. Prescrevendo (O que devemos fazer?)", 
                    description: "Modelos de otimização para recomendar ações.", 
                    details: "Por fim, a Análise Prescritiva representa o nível mais avançado de maturidade, focado em determinar \"O que devemos fazer?\". Ela vai além da simples previsão, utilizando modelos de otimização e simulação para recomendar as melhores ações possíveis e o impacto esperado de cada decisão. Em vez de apenas prever a demanda, a análise prescritiva sugeriria, por exemplo, qual o nível ideal de estoque e o melhor preço para maximizar o lucro, ajudando a otimizar ativamente as estratégias de negócio.", 
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
                                  style={{ outline: 'none' }}
                                  focusable="false"
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
                    details: "A Engenharia de Prompt é a prática de desenhar, testar e otimizar as instruções (prompts) dadas a um Modelo de Linguagem de Larga Escala (LLM) para obter as respostas mais precisas, relevantes e úteis. É uma habilidade fundamental que envolve não apenas fazer a pergunta certa, mas também fornecer contexto suficiente, exemplos (técnica conhecida como few-shot learning) e restrições claras para guiar o modelo a executar tarefas complexas com alta qualidade, desde resumir textos até gerar código.", 
                    value: 1, 
                    complexity: 1, 
                    color: "hsl(var(--wine-light))" 
                  },
                  { 
                    id: "rag", 
                    icon: Brain, 
                    title: "2. RAG (Busca Aumentada)", 
                    description: "Conectando LLMs a dados privados.", 
                    details: "O RAG (Retrieval-Augmented Generation) é uma técnica que potencializa um LLM ao conectá-lo a uma base de conhecimento externa, como documentos privados da empresa, e-mails ou um banco de dados. Em vez de depender apenas do conhecimento estático com o qual foi treinado, o modelo primeiro \"busca\" (retrieve) informações relevantes dessa fonte de dados externa e, em seguida, usa esses dados \"aumentados\" como contexto para gerar uma resposta precisa, atualizada e baseada em informações privadas que o modelo originalmente desconhecia.", 
                    value: 2, 
                    complexity: 2, 
                    color: "hsl(var(--wine-medium))" 
                  },
                  { 
                    id: "finetuning", 
                    icon: Brain, 
                    title: "3. Fine-tuning (Especialização)", 
                    description: "Treinando o modelo em tarefas específicas.", 
                    details: "O Fine-tuning (Ajuste Fino ou Especialização) é o processo de continuar o treinamento de um LLM pré-treinado, mas agora com um conjunto de dados menor e específico de um domínio ou tarefa. Diferente do RAG, que injeta conhecimento no prompt, o fine-tuning modifica os \"pesos\" internos do próprio modelo. Isso o torna um especialista em um estilo de linguagem particular (como o tom de voz de uma marca), em um formato de dados específico (como laudos médicos) ou em uma tarefa muito nichada, melhorando drasticamente seu desempenho e comportamento naquela área.", 
                    value: 3, 
                    complexity: 3, 
                    color: "hsl(var(--wine-dark))" 
                  },
                  { 
                    id: "agents", 
                    icon: Brain, 
                    title: "4. Multi-Agentes (Autonomia)", 
                    description: "IAs que planejam e executam tarefas.", 
                    details: "Os sistemas Multi-Agentes representam um nível avançado de autonomia, onde múltiplas \"IAs\" (agentes), cada uma muitas vezes impulsionada por um LLM, colaboram para resolver um problema complexo que seria difícil para um único modelo. Um agente \"planejador\" pode quebrar uma tarefa grande (ex: \"analisar concorrentes e criar um plano de marketing\") em subtarefas, que são então delegadas e executadas por agentes \"especialistas\" (ex: um agente de pesquisa, um agente redator, um agente analista), que trabalham de forma coordenada para entregar um resultado final completo.", 
                    value: 4, 
                    complexity: 4, 
                    color: "hsl(var(--wine-deeper))" 
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
                                  style={{ outline: 'none' }}
                                  focusable="false"
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
