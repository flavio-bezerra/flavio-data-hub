import { Target } from "lucide-react";
import SubtleBackground from "@/components/SubtleBackground";
import ScrollReveal from "@/components/ScrollReveal";

const About = () => {
  return (
    <section className="py-20 bg-secondary/50 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <SubtleBackground />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
              Sobre Mim
            </h2>
          </ScrollReveal>
          
          <div className="space-y-8 text-xl text-muted-foreground leading-relaxed">
            {/* Site Objective Block */}
            <ScrollReveal delay={0.1}>
              <div className="p-4 sm:p-6 rounded-lg bg-gradient-to-r from-primary/10 to-gold/10 border border-white/10 mb-8">
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
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="p-4 sm:p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-colors duration-300 hover:scale-[1.02] transform transition-transform">
                <span className="text-foreground font-semibold text-xl sm:text-2xl">Data Science</span> foi a forma pela qual meu foco em{" "}
                <span className="text-primary font-semibold">resolver problemas complexos</span> se concretizou.
                A partir de uma estrutura sólida baseada na{" "}
                <span className="text-gold font-semibold">análise de dados internos</span>,
                tornou-se possível reduzir custos, otimizar processos e, principalmente, gerar resultados de alta performance
                de maneira <span className="text-gold font-semibold">mensurável</span> e alinhada ao core do negócio.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="p-4 sm:p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-gold/20 hover:border-gold/40 transition-colors duration-300 hover:scale-[1.02] transform transition-transform">
                Ao longo da confecção de diversos projetos nas áreas de <span className="font-semibold text-gold">Varejo, Indústria, Supply Chain, P&D/Técnico, Jurídico, Financeiro, Administrativo, Marketing & Vendas, RH/People Analytics e Customer Success</span>,
                aprofundei minha especialização em{" "}
                <span className="text-primary font-semibold">Machine Learning, IA Generativa (LLMs), Análise Exploratória (EDA) e MLOps</span>.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="text-center pt-4 sm:pt-8">
                <p className="text-xl sm:text-2xl md:text-3xl font-script text-foreground p-4 sm:p-6 rounded-lg bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/30 hover:scale-105 transition-transform duration-300">
                  Mais que dados, <span className="text-gold">estratégia</span>.
                  <br />
                  Mais que insights, <span className="text-primary">resultados</span>.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <p className="text-lg text-muted-foreground text-center mt-12 italic">
                Antes de gerar valor, precisamos construir uma visão comum sobre o verdadeiro significado da Ciência de Dados no ambiente corporativo.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
