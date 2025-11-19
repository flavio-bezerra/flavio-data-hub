import { useState } from "react";
import { Briefcase, Database, Filter, BrainCircuit, CheckCheck, Rocket, ArrowDown, ArrowUp, ArrowRight, ArrowLeft, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Dados para as 6 etapas do CRISP-DM
const crispSteps = [
  {
    id: 0,
    icon: Briefcase,
    number: "1",
    shortTitle: "Entendimento do Negócio",
    fullTitle: "1. Entendimento do Negócio (Business Understanding)",
    details: "A etapa mais importante. Antes de escrever qualquer código, focamos em entender: Qual é a dor do negócio? O que queremos resolver? E como vamos medir o sucesso (KPIs)?",
    color: "primary"
  },
  {
    id: 1,
    icon: Database,
    number: "2",
    shortTitle: "Entendimento dos Dados",
    fullTitle: "2. Entendimento dos Dados (Data Understanding)",
    details: "Olhamos para o que temos em casa. Os dados existem? São confiáveis? Têm qualidade suficiente para responder nossas perguntas? Agimos como detetives.",
    color: "gold"
  },
  {
    id: 2,
    icon: Filter,
    number: "3",
    shortTitle: "Preparação dos Dados",
    fullTitle: "3. Preparação dos Dados (Data Preparation)",
    details: "A parte 'invisível' e mais trabalhosa (90% do tempo). Limpar, organizar e traduzir os dados brutos para uma linguagem que o computador entenda.",
    color: "primary"
  },
  {
    id: 3,
    icon: BrainCircuit,
    number: "4",
    shortTitle: "Modelagem",
    fullTitle: "4. Modelagem (Modeling)",
    details: "Aqui a 'mágica' acontece. Testamos diferentes algoritmos para encontrar aquele que melhor aprende com o passado para prever o futuro com precisão.",
    color: "wine"
  },
  {
    id: 4,
    icon: CheckCheck,
    number: "5",
    shortTitle: "Avaliação",
    fullTitle: "5. Avaliação (Evaluation)",
    details: "O modelo acertou na matemática, mas resolve o problema? Se não trouxer dinheiro ou eficiência, não serve. Validamos o impacto financeiro antes de seguir.",
    color: "gold"
  },
  {
    id: 5,
    icon: Rocket,
    number: "6",
    shortTitle: "Implantação",
    fullTitle: "6. Implantação (Deployment)",
    details: "Tirar do laboratório e colocar na vida real. O modelo passa a tomar decisões ou gerar recomendações automaticamente, integrado aos sistemas da empresa.",
    color: "wine"
  }
];

const StepCardDesktop = ({ step, isActive, onClick, labelPosition = "bottom" }: { step: typeof crispSteps[0], isActive: boolean, onClick: () => void, labelPosition?: "top" | "bottom" }) => {
  const Icon = step.icon;
  return (
    <motion.div 
      className="relative cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
    >
      <div className={cn(
        "w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-20 relative bg-card",
        isActive ? "shadow-[0_0_20px_-5px_currentColor]" : "border-border group-hover:border-primary/50"
      )}
      style={{
        borderColor: isActive ? `hsl(var(--${step.color}))` : undefined,
        color: isActive ? `hsl(var(--${step.color}))` : undefined
      }}
      >
        <Icon size={32} style={{ color: isActive ? `hsl(var(--${step.color}))` : `hsl(var(--muted-foreground))` }} />
      </div>
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md z-30",
        labelPosition === "top" ? "-top-12" : "-bottom-12"
      )}>
        <span className={cn(
          "text-sm font-bold transition-colors duration-300",
        )}
        style={{ color: isActive ? `hsl(var(--${step.color}))` : `hsl(var(--muted-foreground))` }}
        >
          {step.number}. {step.shortTitle}
        </span>
      </div>
    </motion.div>
  );
};

const Methodology = () => {
  const [activeCrispStep, setActiveCrispStep] = useState<number>(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-secondary/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-1/3 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"
          animate={{ 
            y: [0, 40, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Título da Seção */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center gradient-text leading-tight pb-2"
            variants={itemVariants}
          >
            Metodologia de Projeto
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-muted-foreground text-center leading-relaxed px-4"
            variants={itemVariants}
          >
            Como transformamos uma dúvida vaga em uma solução que funciona? Seguindo um mapa testado e aprovado pelo mercado global.
          </motion.p>
        </motion.div>

        <div className="flex flex-col xl:flex-row items-center xl:items-start gap-12 xl:gap-8">
          
          {/* Bloco 2: O Ciclo Interativo (Fluxograma) */}
          <motion.div 
            className="w-full xl:flex-1 order-2 xl:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h3 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-12 text-center px-4"
              variants={itemVariants}
            >
              As 6 Etapas do Ciclo CRISP-DM
            </motion.h3>

            {/* MOBILE LAYOUT (Vertical List) */}
            <div className="lg:hidden relative w-full max-w-md mx-auto">
              {crispSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeCrispStep === index;
                return (
                  <motion.div key={step.id} className="relative mb-4" variants={itemVariants}>
                    <div
                      onClick={() => setActiveCrispStep(isActive ? -1 : index)}
                      className={cn(
                        "rounded-xl border-2 cursor-pointer overflow-hidden transition-all duration-300",
                        isActive ? "shadow-lg scale-[1.02]" : "hover:scale-[1.01]"
                      )}
                      style={{
                        backgroundColor: isActive ? `hsl(var(--${step.color}) / 0.15)` : `hsl(var(--card) / 0.5)`,
                        borderColor: isActive ? `hsl(var(--${step.color}))` : `hsl(var(--border) / 0.5)`
                      }}
                    >
                      <div className="p-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0" style={{ backgroundColor: `hsl(var(--${step.color}) / 0.2)` }}>
                          <Icon className="w-6 h-6" style={{ color: `hsl(var(--${step.color}))` }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base">{step.shortTitle}</h4>
                        </div>
                        <ArrowDown className={cn("w-5 h-5 transition-transform", isActive && "rotate-180")} />
                      </div>
                      {isActive && (
                        <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground border-t border-border/50 mt-2 pt-2">
                          {step.details}
                        </div>
                      )}
                    </div>
                    {index < crispSteps.length - 1 && (
                      <div className="flex justify-center my-2">
                        <ArrowDown className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* DESKTOP LAYOUT (Horizontal Flow) */}
            <div className="hidden lg:flex flex-row items-center justify-center gap-4 xl:gap-8 relative py-20">
              
              {/* Step 1: Business Understanding (Left) */}
              <motion.div 
                className="relative z-20 cursor-pointer group shrink-0"
                onClick={() => setActiveCrispStep(0)}
                whileHover={{ scale: 1.05 }}
              >
                <div className={cn(
                  "w-48 p-4 rounded-xl border-2 text-center transition-all duration-300 bg-card",
                  activeCrispStep === 0 ? "bg-primary/20 border-primary shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]" : "border-border hover:border-primary/50"
                )}>
                  <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-primary/20 text-primary">
                      <Briefcase size={24} />
                    </div>
                  </div>
                  <h4 className="font-bold text-base">1. Entendimento do Negócio</h4>
                </div>
                {/* Arrow to Cycle */}
                <ArrowRight className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground animate-pulse" />
              </motion.div>

              {/* The Cycle Container (Center) */}
              <div className="relative w-[500px] h-[500px] shrink-0 flex items-center justify-center">
                
                {/* Connecting Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                  {/* 2 -> 3 (Top Arc) */}
                  <path d="M150 60 Q 250 10 350 60" fill="none" stroke="hsl(var(--gold))" strokeWidth="3" markerEnd="url(#arrowhead-gold)" />
                  {/* 3 -> 4 (Right Arc) */}
                  <path d="M440 150 Q 490 250 440 350" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" markerEnd="url(#arrowhead-primary)" />
                  {/* 4 -> 5 (Bottom Arc) */}
                  <path d="M350 440 Q 250 490 150 440" fill="none" stroke="hsl(var(--wine))" strokeWidth="3" markerEnd="url(#arrowhead-wine)" />
                  {/* 5 -> 2 (Left Arc - Loop) */}
                  <path d="M60 350 Q 10 250 60 150" fill="none" stroke="hsl(var(--gold))" strokeWidth="3" strokeDasharray="4 4" markerEnd="url(#arrowhead-gold)" />
                  
                  <defs>
                    <marker id="arrowhead-gold" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--gold))" />
                    </marker>
                    <marker id="arrowhead-primary" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
                    </marker>
                    <marker id="arrowhead-wine" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--wine))" />
                    </marker>
                  </defs>
                </svg>

                {/* Central Details Panel */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <motion.div 
                    className="w-64 h-64 bg-card/95 backdrop-blur-md border-2 border-border rounded-full p-5 flex flex-col items-center justify-center text-center shadow-2xl pointer-events-auto z-30"
                    key={activeCrispStep}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeCrispStep !== -1 ? (
                      <>
                        <div className="mb-2 p-2 rounded-full bg-secondary/50">
                          {(() => {
                            const Icon = crispSteps[activeCrispStep].icon;
                            return <Icon size={28} style={{ color: `hsl(var(--${crispSteps[activeCrispStep].color}))` }} />;
                          })()}
                        </div>
                        <h4 className="font-bold text-base mb-2 leading-tight" style={{ color: `hsl(var(--${crispSteps[activeCrispStep].color}))` }}>
                          {crispSteps[activeCrispStep].shortTitle}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-6">
                          {crispSteps[activeCrispStep].details}
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <RotateCw size={40} className="mb-2 opacity-20" />
                        <p className="text-sm">Clique em uma etapa</p>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Cycle Steps Positioning (Absolute) */}
                {/* Top Left: Data Und (2) */}
                <div className="absolute top-[8%] left-[8%]">
                  <StepCardDesktop step={crispSteps[1]} isActive={activeCrispStep === 1} onClick={() => setActiveCrispStep(1)} labelPosition="top" />
                </div>
                {/* Top Right: Data Prep (3) */}
                <div className="absolute top-[8%] right-[8%]">
                  <StepCardDesktop step={crispSteps[2]} isActive={activeCrispStep === 2} onClick={() => setActiveCrispStep(2)} labelPosition="top" />
                </div>
                {/* Bottom Right: Modeling (4) */}
                <div className="absolute bottom-[8%] right-[8%]">
                  <StepCardDesktop step={crispSteps[3]} isActive={activeCrispStep === 3} onClick={() => setActiveCrispStep(3)} labelPosition="bottom" />
                </div>
                {/* Bottom Left: Evaluation (5) */}
                <div className="absolute bottom-[8%] left-[8%]">
                  <StepCardDesktop step={crispSteps[4]} isActive={activeCrispStep === 4} onClick={() => setActiveCrispStep(4)} labelPosition="bottom" />
                </div>
              </div>

              {/* Step 6: Deployment (Right) */}
              <motion.div 
                className="relative z-20 cursor-pointer group shrink-0"
                onClick={() => setActiveCrispStep(5)}
                whileHover={{ scale: 1.05 }}
              >
                {/* Arrow from Cycle */}
                <ArrowRight className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground animate-pulse" />
                
                <div className={cn(
                  "w-48 p-4 rounded-xl border-2 text-center transition-all duration-300 bg-card",
                  activeCrispStep === 5 ? "bg-wine/20 border-wine shadow-[0_0_30px_-5px_hsl(var(--wine)/0.5)]" : "border-border hover:border-wine/50"
                )}>
                  <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-wine/20 text-wine">
                      <Rocket size={24} />
                    </div>
                  </div>
                  <h4 className="font-bold text-base">6. Implantação</h4>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Bloco 1: CRISP-DM vs. Agile (Sidebar on XL) */}
          <motion.div 
            className="w-full max-w-4xl xl:w-[500px] shrink-0 order-1 xl:order-2 p-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-lg xl:sticky xl:top-24 h-fit"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-bold mb-8 text-primary flex items-center gap-3">
              <BrainCircuit className="w-8 h-8" />
              Data Science vs. Agile
            </h3>
            <div className="space-y-8 text-muted-foreground text-base leading-relaxed">
              <div className="p-6 rounded-lg bg-secondary/50 border border-border/50">
                <h4 className="font-bold text-lg text-foreground mb-3">Desenvolvimento de Software</h4>
                <p className="text-lg">
                  Metodologias Ágeis (Scrum) focam em <strong>velocidade de entrega</strong>. O objetivo é claro (ex: "criar login"), o risco é o tempo.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-bold text-lg text-foreground mb-3">Data Science</h4>
                <p className="text-lg">
                  É <strong>Pesquisa & Descoberta</strong>. Não sabemos se os dados vão responder a pergunta. O risco é investir tempo e não achar nada (viabilidade).
                </p>
              </div>

                O <span className="text-gold font-bold text-xl">CRISP-DM</span> existe para reduzir esse risco: falhamos rápido se for preciso, ou acertamos o alvo com precisão antes de gastar recursos construindo.
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Methodology;
