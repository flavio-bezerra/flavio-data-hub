import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, AlertCircle, TrendingUp, Lightbulb, Brain, ArrowLeft } from "lucide-react";

const analyticsLevels = [
  {
    icon: Search,
    title: "Análise Descritiva",
    question: "O que aconteceu?",
    description: "Para obter insights de dados históricos",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: AlertCircle,
    title: "Análise Diagnóstica",
    question: "Por que aconteceu?",
    description: "Para encontrar a causa raiz dos problemas",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Análise Preditiva",
    question: "O que vai acontecer?",
    description: "Para realizar predições sobre eventos futuros",
    color: "from-primary to-blue-500",
  },
  {
    icon: Lightbulb,
    title: "Análise Prescritiva",
    question: "Como podemos fazer acontecer?",
    description: "Para dar suporte a decisões e otimizações",
    color: "from-gold to-yellow-500",
  },
];

const WhatIsDataScience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stagger the card animations
          analyticsLevels.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index]);
            }, index * 200);
          });
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
        <div className="max-w-6xl mx-auto mb-16">
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-12">
              Os Três Pilares da Ciência de Dados
            </h3>

            {/* Venn Diagram Container with Label */}
            <div className="relative w-full max-w-4xl mx-auto h-[450px] mb-16 flex items-center justify-center">
              {/* Diagram */}
              <div className="relative w-full max-w-2xl h-[450px] flex items-center justify-center">
                {/* SVG Pattern for Hatching */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <defs>
                    <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="2" opacity="0.6" />
                    </pattern>
                  </defs>
                  {/* Central intersection circle with hatching */}
                  <circle cx="50%" cy="56%" r="30" fill="url(#hatch)" />
                </svg>

                {/* Programming Circle - Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-primary/30 border-4 border-primary flex items-start justify-center pt-8">
                  <span className="text-primary font-bold text-xl">Programação</span>
                </div>
                
                {/* Statistics Circle - Bottom Left */}
                <div className="absolute bottom-0 left-[15%] w-72 h-72 rounded-full bg-gold/30 border-4 border-gold flex items-end justify-start pb-8 pl-12">
                  <span className="text-gold font-bold text-xl">Estatística</span>
                </div>
                
                {/* Business Circle - Bottom Right */}
                <div className="absolute bottom-0 right-[15%] w-72 h-72 rounded-full bg-wine/30 border-4 border-wine flex items-end justify-end pb-8 pr-12">
                  <span className="text-wine font-bold text-xl">Negócio</span>
                </div>
              </div>

              {/* Label with Arrow - Positioned to the right */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
                <ArrowLeft className="w-12 h-12 text-foreground" strokeWidth={3} />
                <div className="text-left">
                  <span className="font-bold text-xl text-foreground block">Ciência de Dados</span>
                  <span className="font-bold text-lg text-muted-foreground">(Valor)</span>
                </div>
              </div>
            </div>

            {/* Three Columns Explanation */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Programming */}
              <div className="text-left">
                <h4 className="text-2xl font-bold mb-4 text-primary">
                  1. Programação<br />(O Motor)
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Também chamado de 'Hacking Skills', é o motor que nos permite coletar, processar e analisar bilhões 
                  de informações em alta velocidade, tornando a análise em larga escala viável.
                </p>
              </div>

              {/* Statistics */}
              <div className="text-left">
                <h4 className="text-2xl font-bold mb-4 text-gold">
                  2. Estatística<br />(A Lógica)
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Este pilar é a lógica que valida a análise. Fornece os métodos rigorosos para encontrar padrões, 
                  testar hipóteses e diferenciar um sinal verdadeiro de um ruído aleatório.
                </p>
              </div>

              {/* Business */}
              <div className="text-left">
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
            <div className="max-w-3xl mx-auto text-center">
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

        {/* Approach */}
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Da Pergunta ao Resultado
            </h3>
            <p className="text-xl text-muted-foreground">
              Meu trabalho é guiar as decisões de negócio através de{" "}
              <span className="text-gold font-semibold">5 níveis de maturidade analítica</span>:
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {analyticsLevels.map((level, index) => {
              const Icon = level.icon;
              const isCardVisible = visibleCards.includes(index);
              
              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden group hover:scale-105 transition-all duration-500 ${
                    isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                  ></div>

                  {/* Content */}
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${level.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2">{level.title}</h4>
                        <p className="text-lg text-primary font-semibold mb-2">
                          {level.question}
                        </p>
                        <p className="text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Animated Border */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${level.color} transform origin-left transition-transform duration-500 ${
                      isCardVisible ? "scale-x-100" : "scale-x-0"
                    }`}
                    style={{ width: "100%" }}
                  ></div>
                </Card>
              );
            })}
          </div>

          {/* IA Generativa Box - Full Width */}
          <Card
            className={`relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 border-2 ${
              visibleCards.length >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ borderColor: "hsl(var(--wine))" }}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-wine to-red-900 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative p-8 space-y-6">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-wine to-red-900 flex-shrink-0">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl md:text-3xl font-bold mb-3 text-wine">
                    IA Generativa & LLMs
                  </h4>
                  <p className="text-xl text-primary font-semibold mb-4">
                    Como podemos criar, automatizar e escalar o conhecimento?
                  </p>
                  <p className="text-muted-foreground text-lg mb-6">
                    Utilizando o poder de Modelos de Linguagem (LLMs) para construir soluções avançadas, incluindo:
                  </p>
                  
                  {/* Lista de Tópicos */}
                  <ul className="grid md:grid-cols-2 gap-4">
                    <li className="flex items-start gap-3">
                      <span className="text-wine text-xl mt-1">•</span>
                      <span className="text-foreground text-lg">Engenharia de Prompt</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-wine text-xl mt-1">•</span>
                      <span className="text-foreground text-lg">RAG (Retrieval-Augmented Generation)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-wine text-xl mt-1">•</span>
                      <span className="text-foreground text-lg">Fine-tuning de Modelos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-wine text-xl mt-1">•</span>
                      <span className="text-foreground text-lg">Criação de Agentes e Multiagentes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Animated Border Bottom */}
            <div
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-wine to-red-900 transform origin-left transition-transform duration-500 delay-700 ${
                visibleCards.length >= 4 ? "scale-x-100" : "scale-x-0"
              }`}
              style={{ width: "100%" }}
            ></div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhatIsDataScience;
