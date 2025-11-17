import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import logo from "@/assets/logo-white.png";

const Contact = () => {
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
    <section ref={sectionRef} className="py-20 bg-background border-t border-border relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gold rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 gradient-text leading-tight pb-2 ${isVisible ? 'animate-fade-in' : ''}`}>
            Vamos nos Conectar?
          </h2>
          <p className={`text-base sm:text-lg md:text-xl text-muted-foreground mb-10 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}>
            Interessado em trocar ideias sobre dados e inovação? 
            Meu principal canal de contato é o <span className="text-primary font-semibold">LinkedIn</span>.
          </p>

          <Button
            size="lg"
            className={`bg-primary hover:bg-primary/90 transform hover:scale-110 transition-all duration-300 tech-glow hover:shadow-2xl mb-12 group ${
              isVisible ? 'animate-scale-in stagger-2' : ''
            }`}
            asChild
          >
            <a
              href="https://www.linkedin.com/in/flavio-m-bezerra"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="mr-2 h-5 w-5 group-hover:animate-float" />
              Conectar no LinkedIn
            </a>
          </Button>

          {/* Logo */}
          <div className={`flex justify-center mb-6 ${isVisible ? 'animate-fade-in stagger-3' : ''}`}>
            <img src={logo} alt="FMB Logo" className="h-20 opacity-80 hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Tagline */}
          <div className={`p-6 rounded-lg bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/20 mb-8 ${isVisible ? 'animate-scale-in stagger-4' : ''}`}>
            <p className="text-2xl md:text-3xl font-script text-foreground">
              Mais que dados, <span className="text-gold">estratégia</span>.{" "}
              Mais que insights, <span className="text-primary">resultados</span>.
            </p>
          </div>

          {/* Copyright */}
          <p className={`text-sm text-muted-foreground ${isVisible ? 'animate-fade-in stagger-5' : ''}`}>
            © {new Date().getFullYear()} Flávio Menegueço Bezerra. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
