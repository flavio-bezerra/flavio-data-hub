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
    <section ref={sectionRef} className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Sobre Mim
          </h2>
          <div className="space-y-6 text-xl text-muted-foreground leading-relaxed">
            <p>
              <span className="text-foreground font-semibold">Data Science</span> foi a forma pela qual meu foco em{" "}
              <span className="text-primary font-semibold">resolver problemas complexos</span> se concretizou. 
              A partir de uma estrutura sólida baseada na{" "}
              <span className="text-gold font-semibold">análise de dados internos</span>, 
              tornou-se possível reduzir custos, otimizar processos e, principalmente, gerar resultados de alta performance 
              de maneira <span className="text-gold font-semibold">mensurável</span> e alinhada ao core do negócio.
            </p>
            <p>
              Ao longo da confecção de diversos projetos nas áreas de Varejo, Indústria e Supply Chain, 
              aprofundei minha especialização em{" "}
              <span className="text-foreground font-semibold">Machine Learning, IA Generativa (LLMs), Análise Exploratória (EDA) e MLOps</span>.
            </p>
            <p className="text-center pt-4 text-2xl md:text-3xl font-script text-foreground">
              Mais que dados, <span className="text-gold">estratégia</span>. 
              Mais que insights, <span className="text-primary">resultados</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
