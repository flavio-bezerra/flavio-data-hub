import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Linkedin, Github, BookOpen } from "lucide-react";

const Portfolio = () => {
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

  const expertise = [
    "Machine Learning (Modelos Supervisionados e Não Supervisionados)",
    "IA Generativa (Large Language Models - LLMs)",
    "Análise Exploratória de Dados (EDA)",
    "MLOps e Deployment de Modelos",
    "Aplicações em Varejo, Indústria e Supply Chain",
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Projetos e Artigos
          </h2>

          <Card className="p-8 mb-12 bg-card/50 backdrop-blur-sm">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Minha experiência é focada na aplicação prática de tecnologias de ponta para 
              resolver desafios reais de negócio. Você pode explorar os detalhes, códigos e 
              artigos sobre meus projetos nos links abaixo.
            </p>

            {/* Expertise List */}
            <div className="space-y-3 mb-8">
              {expertise.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 transition-all duration-500 delay-${index * 100}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              size="lg"
              className="w-full h-auto py-6 bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/50"
              asChild
            >
              <a
                href="https://www.linkedin.com/in/flavio-m-bezerra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2"
              >
                <Linkedin className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-bold">LinkedIn</div>
                  <div className="text-xs opacity-90">Ver Resumo dos Projetos</div>
                </div>
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full h-auto py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <a
                href="https://github.com/flavio-bezerra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2"
              >
                <Github className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-bold">GitHub</div>
                  <div className="text-xs opacity-90">Ver Códigos</div>
                </div>
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full h-auto py-6 border-gold text-gold hover:bg-gold hover:text-background transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <a
                href="https://flaviombezerra.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2"
              >
                <BookOpen className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-bold">Medium</div>
                  <div className="text-xs opacity-90">Ler Artigos</div>
                </div>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
