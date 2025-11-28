import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target } from "lucide-react";
import SubtleBackground from "@/components/SubtleBackground";

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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
        duration: 0.6
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-secondary/50 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <SubtleBackground />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            Sobre Mim
          </motion.h2>
          <div className="space-y-8 text-xl text-muted-foreground leading-relaxed">
            {/* Site Objective Block */}
            <motion.div
              className="p-4 sm:p-6 rounded-lg bg-gradient-to-r from-primary/10 to-gold/10 border border-white/10 mb-8"
              variants={itemVariants}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 rounded-lg bg-background/50 text-primary shadow-sm">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Objetivo deste Hub</h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Este hub é o ponto de convergência entre dados técnicos e decisão estratégica. Aqui, traduzo algoritmos complexos em alavancas de negócio, demonstrando como a Ciência de Dados deixa de ser um custo para se tornar um motor de eficiência.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.p
              className="p-4 sm:p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-foreground font-semibold text-xl sm:text-2xl">Data Science</span> foi a forma pela qual meu foco em{" "}
              <span className="text-primary font-semibold">resolver problemas complexos</span> se concretizou.
              A partir de uma estrutura sólida baseada na{" "}
              <span className="text-gold font-semibold">análise de dados internos</span>,
              tornou-se possível reduzir custos, otimizar processos e, principalmente, gerar resultados de alta performance
              de maneira <span className="text-gold font-semibold">mensurável</span> e alinhada ao core do negócio.
            </motion.p>
            <motion.p
              className="p-4 sm:p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-gold/20 hover:border-gold/40 transition-colors duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              Ao longo da confecção de diversos projetos nas áreas de <span className="font-semibold text-gold">Varejo, Indústria, Supply Chain, P&D/Técnico, Jurídico, Financeiro, Administrativo, Marketing & Vendas, RH/People Analytics e Customer Success</span>,
              aprofundei minha especialização em{" "}
              <span className="text-primary font-semibold">Machine Learning, IA Generativa (LLMs), Análise Exploratória (EDA) e MLOps</span>.
            </motion.p>
            <motion.div
              className="text-center pt-4 sm:pt-8"
              variants={itemVariants}
            >
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl font-script text-foreground p-4 sm:p-6 rounded-lg bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/30"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Mais que dados, <span className="text-gold">estratégia</span>.
                <br />
                Mais que insights, <span className="text-primary">resultados</span>.
              </motion.p>
            </motion.div>
            <motion.p
              className="text-lg text-muted-foreground text-center mt-12 italic"
              variants={itemVariants}
            >
              Antes de gerar valor, precisamos construir uma visão comum sobre o verdadeiro significado da Ciência de Dados no ambiente corporativo.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
