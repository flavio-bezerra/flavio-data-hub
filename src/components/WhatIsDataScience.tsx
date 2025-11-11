import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, AlertCircle, TrendingUp, Lightbulb, Brain } from "lucide-react";

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
            A ciência de dados combina <span className="text-primary font-semibold">estatística</span> e{" "}
            <span className="text-primary font-semibold">ciência da computação</span>, 
            utilizando o método científico e algoritmos para extrair insights e tomar decisões 
            a partir de diversos tipos de dados, sejam eles estruturados ou não.
          </p>
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
