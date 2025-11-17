import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, Target, Database, BarChartHorizontalBig, BrainCircuit, Server } from "lucide-react";

const DataTeam = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const teamRoles = [
    {
      icon: Briefcase,
      roleName: "Business Stakeholder (O Patrocinador)",
      description: "Define o problema de negócio, alinha as expectativas e é o dono da métrica de sucesso (KPI) que queremos impactar.",
      color: "primary"
    },
    {
      icon: Target,
      roleName: "Product Owner (O Tradutor)",
      description: "Faz a ponte entre o negócio e o time técnico. Prioriza o backlog, define critérios de aceite e garante que o produto de dados entregue valor incremental.",
      color: "gold"
    },
    {
      icon: Database,
      roleName: "Engenheiro de Dados (O Arquiteto)",
      description: "Constrói e mantém os 'canos' (pipelines) que coletam, armazenam e disponibilizam os dados de forma confiável e escalável.",
      color: "wine"
    },
    {
      icon: BarChartHorizontalBig,
      roleName: "Analista de Dados / BI (O Historiador)",
      description: "Foca no passado e presente. Responde 'O que aconteceu?' e 'Onde?' através de dashboards e relatórios analíticos.",
      color: "primary"
    },
    {
      icon: BrainCircuit,
      roleName: "Cientista de Dados (O Estrategista/Preditivo)",
      description: "Foca no futuro. Responde 'Por que aconteceu?' e 'O que vai acontecer?' usando estatística e Machine Learning para criar modelos preditivos.",
      color: "gold"
    },
    {
      icon: Server,
      roleName: "Engenheiro de MLOps (O Piloto)",
      description: "Garante que o modelo criado pelo Cientista de Dados funcione em produção, 24/7, monitorando sua performance e gerenciando o deploy.",
      color: "wine"
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="data-team"
      className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-wine rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-primary rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div
        className={`container mx-auto transition-all duration-1000 relative z-10 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center gradient-text leading-tight pb-2 ${isVisible ? 'animate-fade-in' : ''}`}>
          Data Science é um Esporte Coletivo
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
          Embora um único profissional possa abranger várias áreas, projetos de alto impacto são quase sempre resultado de uma equipe colaborativa, onde cada especialista domina uma parte crucial do processo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamRoles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card
                key={index}
                className={`p-6 flex flex-col items-center text-center transition-all duration-500 hover:scale-110 hover:-translate-y-3 hover-lift border-2 group ${
                  isVisible ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                  backgroundColor: `hsl(var(--${role.color}) / 0.1)`,
                  borderColor: `hsl(var(--${role.color}) / 0.3)`,
                  boxShadow: `0 4px 12px hsl(var(--${role.color}) / 0.15)`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div 
                  className="flex items-center justify-center w-16 h-16 mb-4 rounded-full transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-125 animate-glow-pulse"
                  style={{
                    backgroundColor: `hsl(var(--${role.color}) / 0.2)`,
                    boxShadow: `0 0 20px hsl(var(--${role.color}) / 0.3)`
                  }}
                >
                  <Icon 
                    className="w-8 h-8 group-hover:animate-float" 
                    style={{ color: `hsl(var(--${role.color}))` }}
                  />
                </div>
                <h4 
                  className="text-xl font-bold mb-2"
                  style={{ color: `hsl(var(--${role.color}))` }}
                >
                  {role.roleName}
                </h4>
                <p className="text-muted-foreground">{role.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DataTeam;
