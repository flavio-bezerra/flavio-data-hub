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
    <section ref={sectionRef} className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vamos nos Conectar?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Interessado em trocar ideias sobre dados e inovação? 
            Meu principal canal de contato é o <span className="text-primary font-semibold">LinkedIn</span>.
          </p>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/50 mb-12"
            asChild
          >
            <a
              href="https://www.linkedin.com/in/flavio-m-bezerra"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="mr-2 h-5 w-5" />
              Conectar no LinkedIn
            </a>
          </Button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="FMB Logo" className="h-20 opacity-80" />
          </div>

          {/* Tagline */}
          <p className="text-lg text-muted-foreground">
            Mais que insights, <span className="text-gold font-semibold">estratégia</span>.{" "}
            Mais que dados, <span className="text-gold font-semibold">resultados</span>.
          </p>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} Flávio Menegueço Bezerra. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
