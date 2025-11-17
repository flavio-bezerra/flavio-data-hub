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
      description: "Define o problema de negócio, alinha as expectativas e é o dono da métrica de sucesso (KPI) que queremos impactar."
    },
    {
      icon: Target,
      roleName: "Product Owner (O Tradutor)",
      description: "Faz a ponte entre o negócio e o time técnico. Prioriza o backlog, define critérios de aceite e garante que o produto de dados entregue valor incremental."
    },
    {
      icon: Database,
      roleName: "Engenheiro de Dados (O Arquiteto)",
      description: "Constrói e mantém os 'canos' (pipelines) que coletam, armazenam e disponibilizam os dados de forma confiável e escalável."
    },
    {
      icon: BarChartHorizontalBig,
      roleName: "Analista de Dados / BI (O Historiador)",
      description: "Foca no passado e presente. Responde 'O que aconteceu?' e 'Onde?' através de dashboards e relatórios analíticos."
    },
    {
      icon: BrainCircuit,
      roleName: "Cientista de Dados (O Estrategista/Preditivo)",
      description: "Foca no futuro. Responde 'Por que aconteceu?' e 'O que vai acontecer?' usando estatística e Machine Learning para criar modelos preditivos."
    },
    {
      icon: Server,
      roleName: "Engenheiro de MLOps (O Piloto)",
      description: "Garante que o modelo criado pelo Cientista de Dados funcione em produção, 24/7, monitorando sua performance e gerenciando o deploy."
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="data-team"
      className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-muted/20"
    >
      <div
        className={`container mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Data Science é um Esporte Coletivo
        </h2>
        <p className="text-xl text-muted-foreground text-center max-w-4xl mx-auto mb-12">
          Embora um único profissional possa abranger várias áreas, projetos de alto impacto são quase sempre resultado de uma equipe colaborativa, onde cada especialista domina uma parte crucial do processo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamRoles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card
                key={index}
                className="p-6 flex flex-col items-center text-center bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">{role.roleName}</h4>
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
