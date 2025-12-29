import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, Target, Database, BarChartHorizontalBig, BrainCircuit, Server } from "lucide-react";
import { motion, useInView } from "framer-motion";
import SubtleBackground from "@/components/SubtleBackground";
import { useLanguage } from "@/contexts/LanguageContext";

const DataTeam = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const icons = [
    Briefcase,
    Target,
    Database,
    BarChartHorizontalBig,
    BrainCircuit,
    Server,
  ];
  const colors = ["primary", "gold", "wine", "primary", "gold", "wine"];
  const stagesIndices = [
    [0, 4], // Stakeholder
    [0, 4], // PO
    [1, 2], // DE
    [1, 4], // DA
    [2, 3, 4], // DS
    [5], // MLOps
  ];

  const teamRoles = t.dataTeam.roles.map((role, index) => ({
    icon: icons[index],
    roleName: role.name,
    description: role.desc,
    color: colors[index],
    crispStages: stagesIndices[index].map((i) => t.crispStages[i].short),
  }));

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
          {t.dataTeam.title}
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-4xl mx-auto mb-8 sm:mb-12 px-4"
          variants={itemVariants}
        >
          {t.dataTeam.description}
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
        viewport={{ once: false }}
      >
        {t.dataTeam.finalText}
      </motion.p>
    </section>
  );
};

export default DataTeam;
