import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Linkedin, Github, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const Portfolio = () => {
  const expertise = [
    {
      title: "De Modelos de Machine Learning à Produção (MLOps)",
      description: "Não basta criar um modelo; ele precisa gerar valor em produção. Minha experiência cobre o ciclo completo, desde a Análise Exploratória (EDA) e o treinamento de modelos (supervisionados e não supervisionados) até o deployment e monitoramento."
    },
    {
      title: "IA Generativa (LLMs) para Negócios",
      description: "Vou além do hype. Aplico LLMs para criar soluções práticas, como assistentes virtuais (chatbots) e otimização de processos, focando em aplicações que trazem um ROI claro."
    },
    {
      title: "Aplicações Setoriais (Varejo, Indústria e Supply Chain)",
      description: "Cada setor tem um desafio único. Minha especialização é traduzir as necessidades específicas do Varejo, Indústria e Supply Chain em modelos de dados eficientes."
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
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-1/4 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"
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
          className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center gradient-text leading-tight pb-2"
            variants={itemVariants}
          >
            Projetos e Artigos
          </motion.h2>

          <motion.div variants={itemVariants}>
            <Card className="p-4 sm:p-6 md:p-8 mb-12 bg-card/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all duration-500">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                Esta é a seção onde a teoria encontra a prática. Mais do que apenas listar tecnologias, 
                acredito em demonstrar valor real. Meu trabalho se concentra em transformar desafios de 
                negócio complexos em soluções de dados funcionais.
              </p>
              
              <p className="text-base sm:text-lg font-semibold text-foreground mb-6 sm:mb-8">
                Convido você a explorar os projetos, códigos e artigos onde detalho essas implementações.
              </p>

              {/* Expertise Topics */}
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {expertise.map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-4 sm:p-6 rounded-lg bg-gradient-to-r from-card to-card/50 border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:translate-x-2"
                    variants={itemVariants}
                  >
                    <h3 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="break-words">{item.title}</span>
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </motion.div>
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
