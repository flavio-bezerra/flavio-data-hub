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
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Meu trabalho é encontrar as respostas escondidas nos dados. Com formação em 
              <span className="text-foreground font-semibold"> Engenharia Civil (UNESP)</span>, 
              trago uma mentalidade analítica e uma paixão por desafios para o mundo de 
              <span className="text-primary font-semibold"> Data Science</span>.
            </p>
            <p>
              Ao longo da minha carreira, desenvolvi expertise em 
              <span className="text-gold font-semibold"> Machine Learning</span>, 
              <span className="text-gold font-semibold"> IA Generativa (LLMs)</span>, 
              <span className="text-gold font-semibold"> Análise Exploratória (EDA)</span> e 
              <span className="text-gold font-semibold"> MLOps</span>, 
              aplicando essas tecnologias para resolver desafios reais em 
              <span className="text-foreground font-semibold"> Varejo, Indústria e Supply Chain</span>.
            </p>
            <p>
              Meu diferencial está em traduzir complexidade técnica em 
              <span className="text-primary font-semibold"> estratégias de negócio claras</span>, 
              sempre com foco em gerar 
              <span className="text-gold font-semibold"> resultados mensuráveis</span> 
              e valor real para as organizações.
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
