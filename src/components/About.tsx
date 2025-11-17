import { useEffect, useRef, useState } from "react";

const About = () => {
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
    <section ref={sectionRef} className="py-20 bg-secondary/50 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
            Sobre Mim
          </h2>
          <div className="space-y-8 text-xl text-muted-foreground leading-relaxed">
            <p className={`p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20 hover-lift transition-all duration-500 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
              <span className="text-foreground font-semibold text-2xl">Data Science</span> foi a forma pela qual meu foco em{" "}
              <span className="text-primary font-semibold">resolver problemas complexos</span> se concretizou. 
              A partir de uma estrutura sólida baseada na{" "}
              <span className="text-gold font-semibold">análise de dados internos</span>, 
              tornou-se possível reduzir custos, otimizar processos e, principalmente, gerar resultados de alta performance 
              de maneira <span className="text-gold font-semibold">mensurável</span> e alinhada ao core do negócio.
            </p>
            <p className={`p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-gold/20 hover-lift transition-all duration-500 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
              Ao longo da confecção de diversos projetos nas áreas de <span className="font-semibold text-foreground">Varejo, Indústria e Supply Chain</span>, 
              aprofundei minha especialização em{" "}
              <span className="text-foreground font-semibold">Machine Learning, IA Generativa (LLMs), Análise Exploratória (EDA) e MLOps</span>.
            </p>
            <div className={`text-center pt-8 ${isVisible ? 'animate-scale-in stagger-3' : ''}`}>
              <p className="text-2xl md:text-3xl font-script text-foreground p-6 rounded-lg bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/30 tech-glow">
                Mais que dados, <span className="text-gold">estratégia</span>. 
                Mais que insights, <span className="text-primary">resultados</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
