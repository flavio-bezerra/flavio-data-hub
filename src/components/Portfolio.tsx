import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Linkedin, Github, BookOpen } from "lucide-react";
import { motion, useInView } from "framer-motion";
import SubtleBackground from "@/components/SubtleBackground";

const Portfolio = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const expertise = [
    {
      title: "Análise Diagnóstica e Inferência Estatística",
      description: "Antes de prever o futuro, é preciso compreender profundamente o presente e o passado. Realizo análises exploratórias robustas, aplicando inferência estatística para validar hipóteses e análises diagnósticas para identificar a causa raiz de comportamentos e anomalias nos dados."
    },
    {
      title: "Pesquisa Operacional e Simulação",
      description: "Para cenários de alta complexidade, combino o poder preditivo do Machine Learning com a precisão de sistemas de simulação e otimização matemática. Essa abordagem híbrida permite testar cenários (\"what-if\") e tomar decisões ótimas em ambientes dinâmicos."
    },
    {
      title: "De Modelos de Machine Learning à Produção (MLOps)",
      description: "Não basta criar um modelo; ele precisa gerar valor em produção. Minha experiência cobre o ciclo completo, desde a Análise Exploratória (EDA) até o deployment e monitoramento contínuo, assegurando a escalabilidade e a governança das soluções."
    },
    {
      title: "IA Generativa (LLMs) para Negócios",
      description: "Vou além do hype. Aplico LLMs para criar soluções práticas, como assistentes virtuais e otimização de processos baseados em texto, focando estritamente em aplicações que trazem um ROI claro para a organização."
    },
    {
      title: "Core Business vs. Back-Office",
      description: "A ciência de dados é transversal e deve permear toda a organização. Minha especialização é traduzir as necessidades específicas de diversas frentes (Varejo, Indústria, Supply Chain, P&D/Técnico, Jurídico, Financeiro, Administrativo, Marketing & Vendas, RH/People Analytics e Customer Success) em modelos de dados eficientes que resolvem problemas reais de negócio."
    }
  ];

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
    <section ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <SubtleBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center leading-tight pb-2"
            style={{ 
              background: 'linear-gradient(to right, #D4AF37, #4169E1)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}
            variants={itemVariants}
          >
            Portfólio de Soluções
          </motion.h2>

          <motion.div variants={itemVariants}>
            <Card className="p-4 sm:p-6 md:p-8 mb-12 bg-card/50 backdrop-blur-sm border-[#4169E1]/20 hover:shadow-lg transition-all duration-500">
              <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#4169E1' }}>
                Onde a Teoria Encontra a Prática
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                Mais do que apenas listar tecnologias, acredito em demonstrar valor real. Meu trabalho se concentra em transformar desafios de negócio complexos em soluções de dados funcionais, com uma entrega end-to-end: do código à documentação técnica e de negócio detalhada, garantindo que o projeto seja sustentável, auditável e compreensível por todos os stakeholders.
              </p>
              
              <p className="text-base sm:text-lg font-semibold text-foreground mb-6 sm:mb-8">
                Convido você a explorar os projetos, códigos e artigos onde detalho essas implementações:
              </p>

              {/* Expertise Topics */}
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {expertise.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-6 rounded-lg bg-gradient-to-r from-card to-card/50 border border-[#4169E1]/10 hover:border-[#4169E1]/30 transition-all duration-500 hover:translate-x-2"
                  >
                    <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-2" style={{ color: '#4169E1' }}>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#D4AF37' }}></span>
                      <span className="break-words">{item.title}</span>
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <p className="text-base sm:text-lg font-semibold text-foreground text-center py-4">
                Veja como esses conceitos são aplicados na prática:
              </p>
            </Card>
          </motion.div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-auto py-4 sm:py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-2xl group"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/flavio-m-bezerra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <Linkedin className="h-6 w-6 sm:h-8 sm:w-8 group-hover:animate-bounce" />
                  <div className="text-center">
                    <div className="font-bold text-sm sm:text-base">LinkedIn</div>
                    <div className="text-xs opacity-90">Ver Resumo dos Projetos</div>
                  </div>
                </a>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-auto py-4 sm:py-6 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 hover:shadow-2xl group"
                asChild
              >
                <a
                  href="https://github.com/flavio-bezerra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <Github className="h-6 w-6 sm:h-8 sm:w-8 group-hover:animate-bounce" />
                  <div className="text-center">
                    <div className="font-bold text-sm sm:text-base">GitHub</div>
                    <div className="text-xs opacity-90">Ver Códigos</div>
                  </div>
                </a>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="sm:col-span-2 md:col-span-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-auto py-4 sm:py-6 border-gold text-gold hover:bg-gold hover:text-background transition-all duration-300 tech-glow-gold hover:shadow-2xl group"
                asChild
              >
                <a
                  href="https://flaviombezerra.medium.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 group-hover:animate-bounce" />
                  <div className="text-center">
                    <div className="font-bold text-sm sm:text-base">Medium</div>
                    <div className="text-xs opacity-90">Ler Artigos</div>
                  </div>
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
