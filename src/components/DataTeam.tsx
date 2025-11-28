import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, Target, Database, BarChartHorizontalBig, BrainCircuit, Server } from "lucide-react";
import { motion, useInView } from "framer-motion";
import SubtleBackground from "@/components/SubtleBackground";

const DataTeam = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const teamRoles = [
    {
      icon: Briefcase,
      roleName: "Business Stakeholder (O Patrocinador)",
      description: "O Patrocinador Estratégico. Define os KPIs e requisitos de negócio, validando se a solução técnica atende à estratégia corporativa. É responsável pela aprovação da Prova de Conceito (PoC) e pela confirmação do retorno sobre o investimento (ROI).",
      color: "primary",
      crispStages: ["Entendimento do Negócio", "Avaliação"]
    },
    {
      icon: Target,
      roleName: "Product Owner (O Tradutor)",
      description: "A ponte entre a estratégia e a execução técnica. Gerencia o backlog do produto e prioriza as entregas baseadas em valor de negócio. Traduz necessidades complexas em User Stories claras, garantindo que o time desenvolva a feature certa no momento certo.",
      color: "gold",
      crispStages: ["Entendimento do Negócio", "Avaliação"]
    },
    {
      icon: Database,
      roleName: "Engenheiro de Dados (O Arquiteto)",
      description: "Projeta e mantém arquiteturas escaláveis (Data Lakes/Warehouses). Constrói pipelines de ETL/ELT robustos que integram, limpam e disponibilizam dados de diversas fontes, garantindo a qualidade e a governança da matéria-prima analítica.",
      color: "wine",
      crispStages: ["Entendimento dos Dados", "Preparação dos Dados"]
    },
    {
      icon: BarChartHorizontalBig,
      roleName: "Analista de Dados / BI (O Historiador)",
      description: "Especialista em análise descritiva e diagnóstica. Utiliza SQL e ferramentas de Data Viz para transformar dados brutos em dashboards interativos, monitorando métricas históricas e identificando padrões que explicam o comportamento do negócio.",
      color: "primary",
      crispStages: ["Entendimento dos Dados", "Avaliação"]
    },
    {
      icon: BrainCircuit,
      roleName: "Cientista de Dados (O Estrategista/Preditivo)",
      description: "Foca em análise preditiva e prescritiva. Aplica estatística avançada e algoritmos de Machine Learning para treinar modelos que antecipam cenários futuros, realizam recomendações automatizadas e otimizam a tomada de decisão.",
      color: "gold",
      crispStages: ["Preparação dos Dados", "Modelagem", "Avaliação"]
    },
    {
      icon: Server,
      roleName: "Engenheiro de MLOps (O Piloto)",
      description: "Operacionaliza o ciclo de vida do modelo. Implementa esteiras de CI/CD para automação, garante o deploy seguro em produção e monitora a saúde dos modelos (Data/Model Drift), assegurando escalabilidade e alta disponibilidade.",
      color: "wine",
      crispStages: ["Implantação"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        damping: 20
      } as const
    }
  };

  return (
    <section
      ref={sectionRef}
      id="data-team"
      className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden"
    >
      {/* Animated Background */}
      <SubtleBackground />

      <motion.div
        className="container mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center gradient-text leading-tight pb-2"
          variants={itemVariants}
        >
          Composição de uma Squad de Dados
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-4xl mx-auto mb-8 sm:mb-12 px-4"
          variants={itemVariants}
        >
          Nenhum projeto de dados de sucesso é feito por uma pessoa só. É como um time de futebol: cada jogador tem sua posição, e juntos vencem o jogo. Aqui estão os papéis essenciais:
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamRoles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className="p-6 flex flex-col items-center text-center transition-all duration-500 border-2 group h-full hover:shadow-xl"
                  style={{
                    backgroundColor: `hsl(var(--${role.color}) / 0.05)`,
                    borderColor: `hsl(var(--${role.color}) / 0.2)`,
                  }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <div
                      className="flex items-center justify-center w-16 h-16 mb-4 rounded-full transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
                      style={{
                        backgroundColor: `hsl(var(--${role.color}) / 0.15)`,
                        boxShadow: `0 0 20px hsl(var(--${role.color}) / 0.2)`
                      }}
                    >
                      <Icon
                        className="w-8 h-8"
                        style={{ color: `hsl(var(--${role.color}))` }}
                      />
                    </div>
                    <h4
                      className="text-xl font-bold mb-2"
                      style={{ color: `hsl(var(--${role.color}))` }}
                    >
                      {role.roleName}
                    </h4>
                    <p className="text-muted-foreground mb-6">{role.description}</p>
                  </div>

                  <div className="mt-auto w-full pt-4 border-t border-border/30">
                    <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80" style={{ color: `hsl(var(--${role.color}))` }}>
                      CRISP-DM
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {role.crispStages.map((stage, i) => (
                        <span
                          key={i}
                          className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-background/50 border border-border/50 font-medium text-muted-foreground"
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      <motion.p
        className="text-lg text-muted-foreground text-center mt-12 italic relative z-10"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Com o método definido e a equipa montada, resta a pergunta mais importante de qualquer executivo: Quanto vou ganhar com isso?
      </motion.p>
    </section>
  );
};

export default DataTeam;
